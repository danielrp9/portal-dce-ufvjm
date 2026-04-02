from django.db import models
from ckeditor.fields import RichTextField
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime

class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    autor = models.CharField(max_length=100)
    capa = models.ImageField(upload_to='noticias/')
    conteudo = RichTextField()
    data_publicacao = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo

class Evento(models.Model):
    titulo = models.CharField(max_length=200)
    banner = models.ImageField(upload_to='eventos/')
    descricao = models.TextField()
    local = models.CharField(max_length=255)
    data_hora = models.DateTimeField()
    link_ingresso = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.titulo

class Documento(models.Model):
    TIPO_CHOICES = [
        ('EDITAL', 'Edital'), 
        ('TRANSPARENCIA', 'Transparência'), 
        ('INSTITUCIONAL', 'Institucional')
    ]
    titulo = models.CharField(max_length=200)
    arquivo = models.FileField(upload_to='documentos/')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

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
        null=True # Temporário para migração, pode tornar obrigatório depois
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