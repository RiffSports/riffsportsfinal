"""Gera supabase/seed.sql com o catálogo de esportes.

Fonte: "LISTA DE ATIVIDADES ESPORTES, HABILIDADES" (seção Esporte), com
duplicatas unidas, grafias corrigidas e categorias atribuídas.
Rode de novo sempre que a lista mudar: python scripts/build_sports_seed.py
"""
import pathlib
import re
import unicodedata

SPORTS = {
    "coletivo": [
        "Futebol", "Futsal", "Futebol Society", "Futevôlei", "Basquete", "Vôlei", "Vôlei de Praia",
        "Handebol", "Rugby", "Futebol Americano", "Beisebol", "Hóquei sobre Patins",
        "Hóquei no Gelo", "Polo Aquático", "Queimada", "Pique-bandeira", "Taco", "Frisbee",
    ],
    "raquete": [
        "Tênis", "Beach Tennis", "Padel", "Tênis de Mesa", "Badminton", "Squash", "Frescobol", "Peteca",
    ],
    "corrida e ciclismo": [
        "Corrida", "Maratona", "Atletismo", "Trekking", "Trilha", "Ciclismo", "Mountain Bike",
        "Bike BMX", "Bike Freestyle", "Triatlo",
    ],
    "aquático": [
        "Natação", "Nado Sincronizado", "Surf", "Bodyboard", "Kitesurf", "Windsurf", "Stand Up Paddle",
        "Canoagem", "Remo", "Rafting", "Iatismo", "Wakeboard", "Esqui Aquático", "Jet Ski", "Flyboard",
        "Mergulho Apneia", "Mergulho com Cilindro", "Snorkel", "Salto Ornamental", "Pesca Esportiva",
    ],
    "luta": [
        "Boxe", "Muay Thai", "MMA", "Jiu-Jitsu", "Judô", "Karatê", "Taekwondo", "Kung Fu", "Capoeira",
        "Aikido", "Hapkido", "Kendô", "Krav Maga", "Kali Filipino", "Luta Livre", "Luta Greco-romana",
        "Full Contact", "Body Combat", "Esgrima", "Sumô", "Queda de Braço",
    ],
    "fitness": [
        "Funcional", "Crossfit", "Musculação", "Halterofilismo", "Fisiculturismo", "Pilates", "Yoga",
        "Tai Chi Chuan", "Ginástica", "Ginástica Artística", "Ginástica Rítmica", "Ginástica Natural",
        "Dança",
    ],
    "radical": [
        "Skate Street", "Skate Vertical", "Skate Downhill", "Skate Freestyle", "Patins",
        "Patinação Artística", "Parkour", "Slackline", "Escalada", "Rapel", "Montanhismo",
        "Alpinismo", "Espeleologia", "Paraquedismo", "Parapente", "Asa Delta", "Voo Livre",
        "Balonismo", "Esqui na Neve", "Malabarismo",
    ],
    "motor": [
        "Kart", "Automobilismo", "Motocross", "Motovelocidade", "Enduro", "Trilha 4x4",
    ],
    "precisão": [
        "Arco e Flecha", "Tiro Esportivo", "Dardos", "Golfe", "Bocha", "Boliche", "Sinuca", "Bumerangue",
        "Airsoft", "Paintball",
    ],
    "mente": ["Xadrez", "Jogos de Cartas", "E-sports"],
    "equestre": ["Hipismo", "Polo a Cavalo", "Laço"],
    "outros": ["Esportes Caninos", "Jogos Medievais", "Esporte Paralímpico"],
}


def slugify(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_name.lower()).strip("-")


def main() -> None:
    rows, seen = [], set()
    for category, names in SPORTS.items():
        for name in names:
            slug = slugify(name)
            if slug in seen:
                raise SystemExit(f"slug duplicado: {slug}")
            seen.add(slug)
            rows.append(f"  ('{slug}', '{name.replace(chr(39), chr(39) * 2)}', '{category}')")

    sql = (
        "-- Gerado por scripts/build_sports_seed.py. Não edite à mão.\n"
        f"-- {len(rows)} esportes.\n"
        "insert into public.sports (slug, name, category) values\n"
        + ",\n".join(rows)
        + "\non conflict (slug) do update set name = excluded.name, category = excluded.category;\n"
    )
    out = pathlib.Path(__file__).resolve().parent.parent / "supabase" / "seed.sql"
    out.write_text(sql, encoding="utf-8", newline="\n")
    print(f"{len(rows)} esportes -> {out}")


if __name__ == "__main__":
    main()
