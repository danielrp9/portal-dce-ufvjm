import datetime
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class ExercicioFinanceiro(models.Model):
    ano = models.PositiveIntegerField(
        unique=True, 
        validators=[MinValueValidator(2020), MaxValueValidator(2100)],
        default=datetime.date.today().year
    )
    aberto = models.BooleanField(
        default=True, 
        help_text="Se desmarcado, o ano está selado e não aceita novas modificações."
    )
    relatorio_pdf = models.FileField(
        upload_to='financeiro/relatorios/', 
        blank=True, 
        null=True, 
        help_text="Upload do relatório final de prestação de contas assinado."
    )

    class Meta:
        verbose_name = "Exercício Financeiro"
        verbose_name_plural = "Exercícios Financeiros"
        ordering = ['-ano']

    def __str__(self):
        status = "ABERTO" if self.aberto else "ENCERRADO"
        return f"Exercício {self.ano} ({status})"

class Financeiro(models.Model):
    TIPO_TRANSACAO = [('ENTRADA', 'Entrada'), ('SAIDA', 'Saída')]
    
    exercicio = models.ForeignKey(
        ExercicioFinanceiro, 
        on_delete=models.PROTECT, 
        related_name='transacoes',
        null=True
    )
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=12, decimal_places=2)
    tipo = models.CharField(max_length=7, choices=TIPO_TRANSACAO)
    data = models.DateField()

    class Meta:
        verbose_name = "Movimentação Financeira"
        verbose_name_plural = "Financeiro"
        ordering = ['-data']

    def __str__(self):
        prefixo = "(+)" if self.tipo == 'ENTRADA' else "(-)"
        return f"{prefixo} {self.valor} - {self.descricao} ({self.data})"