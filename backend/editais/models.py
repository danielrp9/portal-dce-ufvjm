from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField

class Edital(models.Model):
    CAMPUS_CHOICES = [
        ('GERAL', 'Geral / Todos os Campi'),
        ('DIAMANTINA', 'Diamantina'),
        ('UNAI', 'Unaí'),
        ('MUCURI', 'Mucuri (Teófilo Otoni)'),
        ('JANAUBA', 'Janaúba'),
    ]

    titulo = models.CharField(max_length=500)
    slug = models.SlugField(unique=True, blank=True, max_length=500)
    descricao = RichTextField(help_text="Descrição detalhada sobre o edital.")
    campus = models.CharField(max_length=20, choices=CAMPUS_CHOICES, default='GERAL')
    data_publicacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True, help_text="Se desmarcado, o edital será movido para a seção de encerrados.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Edital"
        verbose_name_plural = "Editais"

class DocumentoEdital(models.Model):
    edital = models.ForeignKey(Edital, related_name='documentos', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=500, help_text="Ex: Edital de Abertura, Resultado Preliminar, etc.")
    arquivo = models.FileField(upload_to='editais/documentos/', blank=True, null=True)
    link = models.URLField(blank=True, null=True, help_text="Link externo opcional (ex: Google Drive, site da UFVJM).")
    data_publicacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.titulo} - {self.edital.titulo}"

    class Meta:
        verbose_name = "Documento do Edital"
        verbose_name_plural = "Documentos dos Editais"
        ordering = ['-data_publicacao']
