import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid, time, pgEnum, PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
    usersToClinics: many(usersToClinicsTable)
}));

export const usersToClinicsTable = pgTable("users_to_clinics", {
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(usersToClinicsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [usersToClinicsTable.userId],
        references: [usersTable.id],
    }),
    clinic: one(clinicsTable, {
        fields: [usersToClinicsTable.clinicId],
        references: [clinicsTable.id],
    })
}));

export const clinicsTable = pgTable("clinics", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
    doctors: many(doctorTable),
    patients: many(patientsTable),
    appointments: many(appointmentsTable),
    usersToClinics: many(usersToClinicsTable)
}));

export const doctorTable = pgTable("doctors", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade", }),
    name: text("name").notNull(),
    avatarImageUrl: text("avatar_image_url"),
    especialty: text("specialty").notNull(),
    appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
    avaibleFromWeekday: integer("available_from_week_day").notNull(),
    avaibleToWeekday: integer("available_to_week_day").notNull(),
    avaibleFromTime: time("available_from_time").notNull(),
    avaibleToTime: time("available_to_time").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const doctorTableRelations = relations(doctorTable, ({ many , one }) => ({
    clinic: one(clinicsTable, {
        fields: [doctorTable.clinicId],
        references: [clinicsTable.id],
    }),
    appointments: many(appointmentsTable),
}));

export const patientsSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone").notNull(),
    sex: patientsSexEnum("sex").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const patientsTableRelations = relations(patientsTable, ({ one }) => ({
    clinic: one(clinicsTable, {
        fields: [patientsTable.clinicId],
        references: [clinicsTable.id],
    })
}));

export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    date: timestamp("date").notNull(),
    patientId: uuid("patient_id").notNull().references(() => patientsTable.id, { onDelete: "cascade", }),
    doctorId: uuid("doctor_id").notNull().references(() => doctorTable.id, { onDelete: "cascade", }),
    clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade", }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
});

export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
    patient: one(patientsTable, {
        fields: [appointmentsTable.patientId],
        references: [patientsTable.id],
    }),
    doctor: one(doctorTable, {
        fields: [appointmentsTable.doctorId],
        references: [doctorTable.id],
    }),
    clinic: one(clinicsTable, {
        fields: [appointmentsTable.clinicId],
        references: [clinicsTable.id],
    })
}));