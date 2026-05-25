from django.db import models

class Evento(models.Model):
    titulo = models.CharField(max_length=200)
    banner = models.ImageField(upload_to='eventos/')
    descricao = models.TextField()
    local = models.CharField(max_length=255)
    data_hora = models.DateTimeField()
    link_ingresso = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.titulo