import datetime
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.db.models import Sum

class ExercicioFinanceiro(models.Model):
    ano = models.PositiveIntegerField(
        unique=True, 
        validators=[MinValueValidator(2020), MaxValueValidator(2100)],
        default=datetime.date.today().year,
        verbose_name="Ano de Exercício"
    )
    aberto = models.BooleanField(
        default=True, 
        verbose_name="Status de Movimentação",
        help_text="Se desmarcado, o ano contábil é selado e o balanço é congelado em definitivo pelo sistema."
    )
    saldo_inicial_transportado = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0.00,
        verbose_name="Saldo Inicial (Vindo do Ano Anterior)",
        help_text="Valor automatizado pelo sistema. Lucro ou Dívida herdada do exercício passado."
    )
    
    # Campos imutáveis preenchidos pelo sistema no momento do encerramento oficial
    total_entrada_fechamento = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="Total de Entradas no Fechamento")
    total_saida_fechamento = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="Total de Saídas no Fechamento")
    saldo_final_fechamento = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="Saldo Final Consolidado no Fechamento")

    class Meta:
        verbose_name = "Exercício Financeiro"
        verbose_name_plural = "Exercícios Financeiros"
        ordering = ['-ano']

    def save(self, *args, **kwargs):
        # 1. HERANÇA AUTOMÁTICA: Se for a criação de um novo ano, busca o saldo final do ano anterior
        if not self.pk:
            ano_anterior = self.ano - 1
            try:
                ex_anterior = ExercicioFinanceiro.objects.get(ano=ano_anterior)
                if ex_anterior.aberto:
                    # Força a consolidação do anterior caso o admin tenha esquecido de fechar na ordem correta
                    ex_anterior.aberto = False
                    ex_anterior.save()
                self.saldo_inicial_transportado = ex_anterior.saldo_final_fechamento
            except ExercicioFinanceiro.DoesNotExist:
                self.saldo_inicial_transportado = 0.00

        # 2. SELAGEM DEFINITIVA: No momento em que o ano é fechado, o sistema congela o razonete histórico
        if self.pk:
            antigo_estado = ExercicioFinanceiro.objects.get(pk=self.pk)
            if antigo_estado.aberto and not self.aberto:
                transacoes = self.transacoes.all()
                entradas = transacoes.filter(tipo='ENTRADA').aggregate(Sum('valor'))['valor__sum'] or 0
                saidas = transacoes.filter(tipo='SAIDA').aggregate(Sum('valor'))['valor__sum'] or 0
                
                self.total_entrada_fechamento = entradas
                self.total_saida_fechamento = saidas
                self.saldo_final_fechamento = self.saldo_inicial_transportado + (entradas - saidas)
                
                # Propaga o saldo final calculado diretamente para o saldo inicial do ano seguinte (se ele já existir)
                ano_seguinte = self.ano + 1
                ExercicioFinanceiro.objects.filter(ano=ano_seguinte).update(
                    saldo_inicial_transportado=self.saldo_final_fechamento
                )

        super().save(*args, **kwargs)

    def __str__(self):
        status = "ABERTO" if self.aberto else "ENCERRADO/CONGELADO"
        return f"Exercício {self.ano} ({status})"


class Financeiro(models.Model):
    TIPO_CHOICES = [
        ('ENTRADA', 'Receita (Entrada em Caixa)'),
        ('SAIDA', 'Despesa (Saída de Caixa)'),
    ]
    
    exercicio = models.ForeignKey(
        ExercicioFinanceiro, 
        on_delete=models.PROTECT, 
        related_name='transacoes',
        verbose_name="Exercício Fiscal"
    )
    descricao = models.CharField(max_length=255, verbose_name="Descrição Clara do Lançamento")
    valor = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0.01)], verbose_name="Valor Operado (R$)")
    tipo = models.CharField(max_length=7, choices=TIPO_CHOICES, verbose_name="Natureza do Fluxo")
    data = models.DateField(verbose_name="Data do Lançamento")

    class Meta:
        verbose_name = "Movimentação Financeira"
        verbose_name_plural = "Livro Caixa (Lançamentos)"
        ordering = ['-data', '-id']

    def clean(self):
        if self.exercicio and not self.exercicio.aberto:
            raise ValidationError(f"Livro Caixa Selado! O exercício de {self.exercicio.ano} já foi encerrado e auditado, impossibilitando novos lançamentos.")
        if self.data and self.exercicio and self.data.year != self.exercicio.ano:
            raise ValidationError({'data': f"A data inserida deve pertencer obrigatoriamente ao ano do exercício contábil selecionado ({self.exercicio.ano})."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        sinal = "(+)" if self.tipo == 'ENTRADA' else "(-)"
        return f"{sinal} R$ {self.valor} - {self.descricao} ({self.data})"