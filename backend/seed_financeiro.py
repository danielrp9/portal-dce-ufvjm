import os
import django
from datetime import datetime
from decimal import Decimal

# 1. Configuração do ambiente Django baseado no seu settings.py
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') 
django.setup()

from dce_portal.models import Financeiro, ExercicioFinanceiro 

def run_seed():
    print("--- Iniciando Carga Completa de Dados Financeiros (DCE UFVJM) ---")
    
    # Lista bruta completa conforme sua solicitação
    dados_brutos = [
        {"id": 1, "desc": "Calourada Unificada", "tipo": "ENTRADA", "valor": "11645.45", "data": "23/06/2025"},
        {"id": 2, "desc": "Doação Social - Aumigos", "tipo": "SAIDA", "valor": "500.00", "data": "23/06/2025"},
        {"id": 3, "desc": "GASTOS COMISSÃO ELEITORAL - CONUNE Diamantina: - R$70 impressões - R$39 urnas - R$10 gasolina | Janauba: - R$30 materiais | Teofilo Otoni: - R$16,80 impressões | Unaí: - R$29 impressões", "tipo": "SAIDA", "valor": "194.80", "data": "23/06/2025"},
        {"id": 4, "desc": "(=) Saldo Atual ---------------------------------------------------", "tipo": "ENTRADA", "valor": "10950.65", "data": "24/06/2025"},
        {"id": 5, "desc": "Doação Social - Arraiá da MEU", "tipo": "SAIDA", "valor": "200.00", "data": "04/07/2025"},
        {"id": 6, "desc": "(=) Saldo Atual ---------------------------------------------------", "tipo": "ENTRADA", "valor": "10750.65", "data": "04/07/2025"},
        {"id": 8, "desc": "Doação Social - Arraiá da Ocupação Vitória", "tipo": "SAIDA", "valor": "200.00", "data": "14/07/2025"},
        {"id": 9, "desc": "Credenciamento e despesas no CONUNE", "tipo": "SAIDA", "valor": "2000.00", "data": "27/07/2025"},
        {"id": 10, "desc": "(=) Saldo Atual ---------------------------------------------------", "tipo": "ENTRADA", "valor": "8550.65", "data": "01/08/2025"},
        {"id": 11, "desc": "Inscrições das Olimpíadas Universitárias", "tipo": "ENTRADA", "valor": "5060.00", "data": "09/12/2025"},
        {"id": 12, "desc": "(=) Saldo Atual ---------------------------------------------------", "tipo": "SAIDA", "valor": "13610.65", "data": "09/12/2025"},
        {"id": 13, "desc": "Quitação parcial das Olimpíadas Universitárias (encerramento do caixa)", "tipo": "SAIDA", "valor": "13610.65", "data": "09/12/2025"},
        {"id": 14, "desc": "(=) Saldo Final ---------------------------------------------------", "tipo": "SAIDA", "valor": "4040.85", "data": "09/12/2025"},
        {"id": 15, "desc": "Festa do Sinal", "tipo": "ENTRADA", "valor": "2300.00", "data": "09/12/2025"},
        {"id": 16, "desc": "Quitação de parcela de Àrbitro das Olimpíadas", "tipo": "SAIDA", "valor": "2200.00", "data": "17/12/2025"},
        {"id": 17, "desc": "Ressarcimento de Placar quebrado", "tipo": "SAIDA", "valor": "62.92", "data": "17/12/2025"},
        {"id": 18, "desc": "(=) Saldo Final ---------------------------------------------------", "tipo": "SAIDA", "valor": "1703.80", "data": "17/12/2025"},
    ]

    count = 0
    for item in dados_brutos:
        try:
            # Tratamento da Data
            data_obj = datetime.strptime(item["data"], "%d/%m/%Y").date()
            ano_ref = data_obj.year
            
            # Garante que o Exercício Financeiro do ano exista
            exercicio, _ = ExercicioFinanceiro.objects.get_or_create(ano=ano_ref)

            # Tratamento do Valor (limpeza de caracteres e conversão para Decimal)
            # Removemos o sinal de menos se houver, pois o 'tipo' já define se é saída
            valor_limpo = item["valor"].replace('-', '').replace('.', '').replace(',', '.')
            valor_decimal = Decimal(valor_limpo)

            # Injeção usando update_or_create para evitar duplicidade se rodar o script 2 vezes
            Financeiro.objects.update_or_create(
                id=item["id"],
                defaults={
                    'exercicio': exercicio,
                    'descricao': item["desc"],
                    'valor': valor_decimal,
                    'tipo': item["tipo"],
                    'data': data_obj
                }
            )
            print(f"ID {item['id']}: {item['desc'][:40]}... | R$ {valor_decimal}")
            count += 1
        except Exception as e:
            print(f"Erro no ID {item.get('id')}: {e}")

    print(f"\n✓ Carga finalizada com sucesso. {count} registros processados.")

if __name__ == "__main__":
    run_seed()