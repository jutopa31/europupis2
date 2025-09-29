import csv
import os
import re
import uuid
from datetime import datetime

SRC_PATH = os.path.join(
    'public',
    'ExportBlock-82bbf1fc-1609-43a3-9e87-93eae9876a47-Part-1',
    'PUPITRASLADOS 21b7986aaf758005a74cc39046cf36fe_all.csv',
)

OUT_DIR = os.path.join('db', 'import_v2')

# Placeholder user_id to fill before import
USER_ID_PLACEHOLDER = 'REPLACE_WITH_USER_ID'

# Deterministic namespace for city UUIDs (constant for this project)
CITY_NAMESPACE = uuid.UUID('c0b5d3f9-5b09-4b9f-9f7d-0e7f0a9a7a77')


def parse_date_to_iso(d: str) -> str | None:
    if not d:
        return None
    d = d.strip()
    # Expect formats like "October 2, 2025"
    try:
        dt = datetime.strptime(d, '%B %d, %Y')
        return dt.date().isoformat()
    except ValueError:
        return None


def to_amount(value: str) -> str | None:
    if not value:
        return None
    s = value.strip()
    # Remove Euro symbol and thousand separators
    s = s.replace('€', '').replace('EUR', '').replace('eur', '')
    s = s.replace('.', '').replace(',', '.') if s.count(',') == 1 and s.count('.') == 0 else s
    s = re.sub(r'[^0-9\.-]', '', s)
    try:
        if s == '':
            return None
        # Keep two decimals as string
        return f"{float(s):.2f}"
    except ValueError:
        return None


def one_line(s: str) -> str:
    # Collapse newlines and repeated whitespace into single spaces
    return re.sub(r"\s+", " ", (s or "")).strip()


def clean_text(s: str) -> str:
    # Trim quotes and collapse newlines/whitespace
    return one_line((s or '').strip().strip('\"').strip())


def load_rows(path: str) -> list[dict]:
    with open(path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    return rows


def ensure_out_dir():
    os.makedirs(OUT_DIR, exist_ok=True)


def main():
    if not os.path.exists(SRC_PATH):
        raise SystemExit(f'Source CSV not found: {SRC_PATH}')

    rows = load_rows(SRC_PATH)

    # Collect unique cities from LOCALIDAD
    city_names: list[str] = []
    for r in rows:
        loc = clean_text(r.get('LOCALIDAD', ''))
        if not loc:
            continue
        key = loc
        if key not in city_names:
            city_names.append(key)

    # Map city -> deterministic UUID
    city_ids: dict[str, str] = {}
    for name in city_names:
        cid = uuid.uuid5(CITY_NAMESPACE, name.lower()).hex
        # Format UUID with dashes
        city_ids[name] = str(uuid.UUID(cid))

    ensure_out_dir()

    # Write cities import CSV + TSV: id,user_id,name
    cities_csv = os.path.join(OUT_DIR, 'cities_import.csv')
    cities_tsv = os.path.join(OUT_DIR, 'cities_import.tsv')
    with open(cities_csv, 'w', encoding='utf-8', newline='') as f, open(cities_tsv, 'w', encoding='utf-8', newline='') as ftsv:
        w = csv.writer(f)
        wtsv = csv.writer(ftsv, delimiter='\t')
        w.writerow(['id', 'user_id', 'name'])
        wtsv.writerow(['id', 'user_id', 'name'])
        for name in city_names:
            row = [city_ids[name], USER_ID_PLACEHOLDER, name]
            w.writerow(row)
            wtsv.writerow(row)

    # Prepare transfers and expenses
    transfers_csv = os.path.join(OUT_DIR, 'city_transfers_import.csv')
    transfers_tsv = os.path.join(OUT_DIR, 'city_transfers_import.tsv')
    transfers_by_name_csv = os.path.join(OUT_DIR, 'city_transfers_by_name.csv')
    transfers_by_name_tsv = os.path.join(OUT_DIR, 'city_transfers_by_name.tsv')
    expenses_csv = os.path.join(OUT_DIR, 'expenses_import.csv')
    expenses_tsv = os.path.join(OUT_DIR, 'expenses_import.tsv')

    with open(transfers_csv, 'w', encoding='utf-8', newline='') as ft, \
         open(transfers_tsv, 'w', encoding='utf-8', newline='') as fttsv, \
         open(transfers_by_name_csv, 'w', encoding='utf-8', newline='') as ftbnc, \
         open(transfers_by_name_tsv, 'w', encoding='utf-8', newline='') as ftbnt, \
         open(expenses_csv, 'w', encoding='utf-8', newline='') as fe, \
         open(expenses_tsv, 'w', encoding='utf-8', newline='') as fetsv:
        wt = csv.writer(ft)
        wttsv = csv.writer(fttsv, delimiter='\t')
        wtbnc = csv.writer(ftbnc)
        wtbnt = csv.writer(ftbnt, delimiter='\t')
        we = csv.writer(fe)
        wetsv = csv.writer(fetsv, delimiter='\t')
        header_transfers = ['id', 'user_id', 'city_id', 'info']
        header_transfers_by_name = ['id', 'user_id', 'city_name', 'info']
        header_expenses = ['id', 'user_id', 'date', 'description', 'amount', 'category', 'paid_by']
        wt.writerow(header_transfers)
        wttsv.writerow(header_transfers)
        wtbnc.writerow(header_transfers_by_name)
        wtbnt.writerow(header_transfers_by_name)
        we.writerow(header_expenses)
        wetsv.writerow(header_expenses)

        for r in rows:
            loc = clean_text(r.get('LOCALIDAD', ''))
            if not loc:
                continue
            city_id = city_ids.get(loc)

            fecha_iso = parse_date_to_iso(clean_text(r.get('FECHA', '')))
            origen = clean_text(r.get('ORIGEN', ''))
            destino = clean_text(r.get('DESTINO', ''))
            medio = clean_text(r.get('MEDIO', ''))
            dur = clean_text(r.get('DURACIÓN', '')) or clean_text(r.get('DURACION', ''))
            link = clean_text(r.get('LINK', ''))
            precio_raw = clean_text(r.get('PRECIO', ''))
            estado = clean_text(r.get('ESTADO', ''))
            check_in = clean_text(r.get('CHECK IN', ''))
            check_out = clean_text(r.get('CHECK OUT', ''))
            otros = clean_text(r.get('OTROS', ''))

            # Build info string for city_transfers
            parts = []
            if fecha_iso:
                parts.append(f'FECHA: {fecha_iso}')
            if origen:
                parts.append(f'ORIGEN: {origen}')
            if destino:
                parts.append(f'DESTINO: {destino}')
            if medio:
                parts.append(f'MEDIO: {medio}')
            if dur:
                parts.append(f'DURACIÓN: {dur}')
            amount = to_amount(precio_raw)
            if amount:
                parts.append(f'PRECIO: {amount} EUR')
            if estado:
                parts.append(f'ESTADO: {estado}')
            if check_in:
                parts.append(f'CHECK-IN: {check_in}')
            if check_out:
                parts.append(f'CHECK-OUT: {check_out}')
            if link:
                parts.append(f'LINK: {link}')
            if otros:
                parts.append(f'OTROS: {otros}')
            info = ' | '.join(parts) if parts else f'{origen} → {destino} ({medio})'

            row_t = [str(uuid.uuid4()), USER_ID_PLACEHOLDER, city_id, one_line(info)]
            wt.writerow(row_t)
            wttsv.writerow(row_t)
            row_tbn = [row_t[0], row_t[1], loc, row_t[3]]
            wtbnc.writerow(row_tbn)
            wtbnt.writerow(row_tbn)

            # Also emit an expense row when we have a valid amount
            if amount:
                desc_bits = []
                if origen or destino:
                    desc_bits.append(f'Traslado: {origen} → {destino}')
                if medio:
                    desc_bits.append(f'({medio})')
                description = ' '.join([b for b in desc_bits if b]) or 'Traslado'
                row_e = [
                    str(uuid.uuid4()),
                    USER_ID_PLACEHOLDER,
                    fecha_iso or '',
                    one_line(description),
                    amount,
                    'Traslado',
                    ''  # paid_by
                ]
                we.writerow(row_e)
                wetsv.writerow(row_e)

    print(f'Generados:')
    print(f' - {cities_csv}')
    print(f' - {cities_tsv}')
    print(f' - {transfers_csv}')
    print(f' - {transfers_tsv}')
    print(f' - {transfers_by_name_csv}')
    print(f' - {transfers_by_name_tsv}')
    print(f' - {expenses_csv}')
    print(f' - {expenses_tsv}')


if __name__ == '__main__':
    main()
