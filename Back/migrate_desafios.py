"""
Database migration script using SQLAlchemy to update desafios_diarios table.
Run this script to migrate the database schema for multi-language template support.
"""

from sqlalchemy import text
from app.database import engine, SessionLocal

def migrate_desafios_table():
    """Apply database migrations for desafios_diarios table."""
    
    migrations = [
        # Step 1: Rename lenguaje to lenguaje_recomendado
        "ALTER TABLE desafios_diarios RENAME COLUMN lenguaje TO lenguaje_recomendado;",
        
        # Step 2: Add new columns
        "ALTER TABLE desafios_diarios ADD COLUMN IF NOT EXISTS dificultad VARCHAR(50) DEFAULT 'Medio' NOT NULL;",
        "ALTER TABLE desafios_diarios ADD COLUMN IF NOT EXISTS xp_recompensa INTEGER DEFAULT 50 NOT NULL;",
        
        # Step 3: Rename firma_funcion to templates_lenguajes_json
        "ALTER TABLE desafios_diarios RENAME COLUMN firma_funcion TO templates_lenguajes_json;",
        
        # Step 4: Change column type to JSONB
        "ALTER TABLE desafios_diarios ALTER COLUMN templates_lenguajes_json TYPE JSONB USING templates_lenguajes_json::jsonb;",
        
        # Step 5: Add constraints
        "ALTER TABLE desafios_diarios ADD CONSTRAINT IF NOT EXISTS check_dificultad_valida CHECK (dificultad IN ('Fácil', 'Medio', 'Difícil'));",
        "ALTER TABLE desafios_diarios ADD CONSTRAINT IF NOT EXISTS check_xp_positivo CHECK (xp_recompensa >= 0);",
        
        # Step 6: Update existing records to proper structure (if any exist)
        """
        UPDATE desafios_diarios
        SET templates_lenguajes_json = jsonb_build_object(
            lenguaje_recomendado, 
            COALESCE(templates_lenguajes_json::text, '# Tu código aquí')
        )
        WHERE templates_lenguajes_json IS NULL 
           OR (templates_lenguajes_json::text != 'null' AND jsonb_typeof(templates_lenguajes_json) != 'object');
        """
    ]
    
    db = SessionLocal()
    try:
        for i, sql in enumerate(migrations, 1):
            print(f"Executing migration step {i}...")
            try:
                db.execute(text(sql))
                db.commit()
                print(f"  ✓ Step {i} completed")
            except Exception as e:
                error_msg = str(e)
                # Check if error is because column already exists/renamed
                if "already exists" in error_msg.lower() or "does not exist" in error_msg.lower():
                    print(f"  ⚠ Step {i} skipped (already applied or column doesn't exist): {error_msg}")
                    db.rollback()
                else:
                    print(f"  ✗ Step {i} failed: {error_msg}")
                    db.rollback()
                    raise
        
        print("\n✓ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting database migration for desafios_diarios table...\n")
    migrate_desafios_table()
