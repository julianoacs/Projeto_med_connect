SELECT 
    id,
    consulta_id,
    medicamentos,
    notas_medicas,
    observacoes,
    conduta,
    status
FROM public.consulta_room
ORDER BY id ASC;