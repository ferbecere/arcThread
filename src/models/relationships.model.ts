// Líderes de facciones
export interface FactionLeader {
  id: string;
  faction_snapshot_id: string;
  character_id: string;
  title?: string; // Ej: "Rey", "General"
  created_at?: string;
}

export interface CreateFactionLeaderDto {
  faction_snapshot_id: string;
  character_id: string;
  title?: string;
}

// Miembros de facciones
export interface FactionMember {
  id: string;
  faction_snapshot_id: string;
  character_id: string;
  role?: string; // Ej: "Soldado", "Espía"
  created_at?: string;
}

export interface CreateFactionMemberDto {
  faction_snapshot_id: string;
  character_id: string;
  role?: string;
}

// Participantes en eventos
export interface EventParticipant {
  id: string;
  event_id: string;
  character_id: string;
  role?: string; // Ej: "Protagonista", "Testigo"
  created_at?: string;
}

export interface CreateEventParticipantDto {
  event_id: string;
  character_id: string;
  role?: string;
}