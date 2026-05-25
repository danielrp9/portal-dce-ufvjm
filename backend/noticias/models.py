from django.db import models
from ckeditor.fields import RichTextField
from django.utils.text import slugify

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