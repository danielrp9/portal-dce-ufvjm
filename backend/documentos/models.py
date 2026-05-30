from django.db import models

class Documento(models.Model):
    TIPO_CHOICES = [
        ('TRANSPARENCIA', 'Transparência'), 
        ('INSTITUCIONAL', 'Institucional')
    ]
    titulo = models.CharField(max_length=200)
    arquivo = models.FileField(upload_to='documentos/')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
