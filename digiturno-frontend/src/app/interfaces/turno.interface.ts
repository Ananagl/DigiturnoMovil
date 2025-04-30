export interface TipoTurno {
    id: number;
    nombre: string;
    icono: string;
    tieneSubtipos: boolean;
}

export interface SubTipoTurno {
    id: number;
    nombre: string;
    tipoTurnoId: number;
    icono: string;
}

export const TIPOS_TURNO: TipoTurno[] = [
    {
        id: 1,
        nombre: 'General',
        icono: 'user',
        tieneSubtipos: false
    },
    {
        id: 2,
        nombre: 'Preferencial',
        icono: 'sillaruedas',
        tieneSubtipos: true
    },
    {
        id: 3,
        nombre: 'Otros',
        icono: 'otros',
        tieneSubtipos: true
    }
];

export const SUBTIPOS_TURNO: SubTipoTurno[] = [
    // Subtipos Preferenciales (id: 2)
    {
        id: 1,
        nombre: 'Adulto mayor',
        tipoTurnoId: 2,
        icono: 'adultomayor'
    },
    {
        id: 2,
        nombre: 'Amatista',
        tipoTurnoId: 2,
        icono: 'diamante'
    },
    {
        id: 3,
        nombre: 'Condición de discapacidad',
        tipoTurnoId: 2,
        icono: 'sillaruedas'
    },
    {
        id: 4,
        nombre: 'Embarazo/\n bebé en brazos',
        tipoTurnoId: 2,
        icono: 'bebeenbrazos'
    },
    {
        id: 5,
        nombre: 'Servicio psicológico',
        tipoTurnoId: 2,
        icono: 'servpsicologico'
    },
    // Subtipos Otros (id: 3)
    {
        id: 6,
        nombre: 'Cita agendada',
        tipoTurnoId: 3,
        icono: 'agendada'
    },
    {
        id: 7,
        nombre: 'LegalApp',
        tipoTurnoId: 3,
        icono: 'legal'
    },
    {
        id: 8,
        nombre: 'PQR',
        tipoTurnoId: 3,
        icono: 'pqr'
    },
    {
        id: 9,
        nombre: 'Seguimiento de caso',
        tipoTurnoId: 3,
        icono: 'segcaso'
    }
]; 