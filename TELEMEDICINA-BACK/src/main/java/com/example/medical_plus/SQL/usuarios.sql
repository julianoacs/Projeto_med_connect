
-- Garante colunas necessárias
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS cpf VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS data_nascimento VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS especialidade VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS tipo_registro VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS numero_registro VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS plano VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS city VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS phone VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS status VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(255);

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP;


-- Permite ADMIN, MEDICO e PACIENTE
ALTER TABLE usuarios
DROP CONSTRAINT IF EXISTS usuarios_tipo_check;

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_tipo_check
CHECK (tipo IN ('ADMIN', 'MEDICO', 'PACIENTE'));


-- Limpa usuários e dependências ligadas a usuários
TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;


-- Recria os usuários
INSERT INTO usuarios (
    nome,
    email,
    senha,
    tipo,
    cpf,
    data_nascimento,
    especialidade,
    tipo_registro,
    numero_registro,
    plano,
    city,
    phone,
    status
) VALUES

-- 1. ADMIN
(
    'Administrador',
    'administrador@hotmail.com',
    '123',
    'ADMIN',
    '999.999.999-99',
    '09/09/1999',
    NULL,
    NULL,
    NULL,
    'PLATINUM',
    'São Paulo',
    '(99) 99999-9999',
    'VALIDADO'
),

-- 2. MÉDICO
(
    'Helena Duarte',
    'helenaduarte@hotmail.com',
    '123',
    'MEDICO',
    '111.222.333-44',
    '18/05/1986',
    'Dermatologista',
    'CRM',
    'CRM-SP 123456',
    NULL,
    'São Paulo',
    '(11) 98472-1936',
    'VALIDADO'
),

-- 3. MÉDICO
(
    'Lucas Ferreira',
    'lucasferreira@hotmail.com',
    '123',
    'MEDICO',
    '222.333.444-55',
    '14/03/1982',
    'Cardiologista',
    'CRM',
    'CRM-SP 234567',
    NULL,
    'São Paulo',
    '(11) 97351-8264',
    'VALIDADO'
),

-- 4. MÉDICO
(
    'Emilly Martins',
    'emillymartins@hotmail.com',
    '123',
    'MEDICO',
    '333.444.555-66',
    '27/08/1989',
    'Neurologista',
    'CRM',
    'CRM-SP 345678',
    NULL,
    'Campinas',
    '(19) 98146-3207',
    'VALIDADO'
),

-- 5. MÉDICO
(
    'Rafael Almeida',
    'rafaelalmeida@hotmail.com',
    '123',
    'MEDICO',
    '444.555.666-77',
    '05/11/1979',
    'Clínico Geral',
    'CRM',
    'CRM-SP 456789',
    NULL,
    'Santos',
    '(13) 96283-7415',
    'VALIDADO'
),

-- 6. MÉDICO
(
    'Henrique Souza',
    'henriquesouza@hotmail.com',
    '123',
    'MEDICO',
    '555.666.777-88',
    '02/02/1985',
    'Nutrologista',
    'CRM',
    'CRM-SP 567890',
    NULL,
    'São Paulo',
    '(11) 97462-5081',
    'VALIDADO'
),

-- 7. MÉDICO
(
    'Marcos Rocha',
    'marcosrocha@hotmail.com',
    '123',
    'MEDICO',
    '666.777.888-99',
    '30/09/1983',
    'Oncologista',
    'CRM',
    'CRM-SP 678901',
    NULL,
    'Guarulhos',
    '(11) 95819-6043',
    'VALIDADO'
),

-- 8. MÉDICO
(
    'Arthur Lima',
    'arthurlima@hotmail.com',
    '123',
    'MEDICO',
    '777.888.999-00',
    '12/12/1988',
    'Ortopedista',
    'CRM',
    'CRM-SP 789012',
    NULL,
    'São Paulo',
    '(11) 96938-2174',
    'VALIDADO'
),

-- 9. PACIENTE
(
    'Paciente Teste',
    'pacienteteste@hotmail.com',
    '123',
    'PACIENTE',
    '888.999.000-11',
    '01/01/2000',
    NULL,
    NULL,
    NULL,
    'PRATA',
    'São Paulo',
    '(11) 98765-4321',
    'VALIDADO'
),

-- 10. PACIENTE
(
    'Ana Oliveira',
    'anaoliveira@hotmail.com',
    '123',
    'PACIENTE',
    '101.202.303-44',
    '22/04/1998',
    NULL,
    NULL,
    NULL,
    'GOLD',
    'São Paulo',
    '(11) 91234-5678',
    'VALIDADO'
),

-- 11. PACIENTE
(
    'Bruno Santos',
    'brunosantos@hotmail.com',
    '123',
    'PACIENTE',
    '202.303.404-55',
    '17/07/1995',
    NULL,
    NULL,
    NULL,
    'BRONZE',
    'Campinas',
    '(19) 92345-6789',
    'VALIDADO'
),

-- 12. PACIENTE
(
    'Carla Mendes',
    'carlamendes@hotmail.com',
    '123',
    'PACIENTE',
    '303.404.505-66',
    '03/10/2001',
    NULL,
    NULL,
    NULL,
    'PLATINUM',
    'Santos',
    '(13) 93456-7890',
    'VALIDADO'
),

-- 13. PACIENTE
(
    'Diego Pereira',
    'diegopereira@hotmail.com',
    '123',
    'PACIENTE',
    '404.505.606-77',
    '29/01/1993',
    NULL,
    NULL,
    NULL,
    'NONE',
    'Guarulhos',
    '(11) 94567-8901',
    'VALIDADO'
),

-- 14. PACIENTE
(
    'Fernanda Alves',
    'fernandaalves@hotmail.com',
    '123',
    'PACIENTE',
    '505.606.707-88',
    '11/09/1997',
    NULL,
    NULL,
    NULL,
    'PRATA',
    'São Bernardo do Campo',
    '(11) 95678-9012',
    'VALIDADO'
),

-- 15. PACIENTE
(
    'Gabriel Nunes',
    'gabrielnunes@hotmail.com',
    '123',
    'PACIENTE',
    '606.707.808-99',
    '25/12/1999',
    NULL,
    NULL,
    NULL,
    'GOLD',
    'Osasco',
    '(11) 96789-0123',
    'VALIDADO'
);


-- Conferência
SELECT
    id,
    nome,
    email,
    senha,
    tipo,
    cpf,
    data_nascimento,
    especialidade,
    tipo_registro,
    numero_registro,
    plano,
    city,
    phone,
    status,
    foto_perfil,
    ultimo_acesso
FROM usuarios
ORDER BY id ASC;