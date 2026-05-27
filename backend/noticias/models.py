from django.db import models
from ckeditor.fields import RichTextField
from django.utils.text import slugify

class Noticia(models.Model):
    CAMPUS_CHOICES = [
        ('GERAL', 'Geral / Todos os Campi'),
        ('DIAMANTINA', 'Diamantina'),
        ('UNAI', 'Unaí'),
        ('MUCURI', 'Mucuri (Teófilo Otoni)'),
        ('JANAUBA', 'Janaúba'),
    ]

    titulo = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    autor = models.CharField(max_length=100)
    capa = models.ImageField(upload_to='noticias/')
    conteudo = RichTextField()
    campus = models.CharField(max_length=20, choices=CAMPUS_CHOICES, default='GERAL')
    tags = models.CharField(
        max_length=255, 
        blank=True, 
        help_text="Insira os assuntos separados por vírgula. Ex: Assuntos Estudantis, Bolsas, Eventos"
    )
    data_publicacao = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo