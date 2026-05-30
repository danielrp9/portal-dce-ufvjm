from django.db import models
from ckeditor.fields import RichTextField
from django.utils.text import slugify

class Artigo(models.Model):
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    autor = models.CharField(max_length=100)
    resumo = models.TextField(help_text="Breve resumo do artigo para listagem")
    conteudo = RichTextField()
    data_publicacao = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo
