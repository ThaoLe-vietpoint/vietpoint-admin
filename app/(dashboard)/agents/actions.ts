"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    // Employee accounts must not manage other accounts
    if (user.user_metadata?.role === "employee") throw new Error("Forbidden");
}

export type Employee = {
    id: string;
    email: string;
    name: string;
    phone: string;
    created_at: string;
    last_sign_in_at: string | null;
};

function toEmployee(u: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
    created_at: string;
    last_sign_in_at?: string | null;
}): Employee {
    return {
        id: u.id,
        email: u.email ?? "",
        name: (u.user_metadata?.name as string) ?? "",
        phone: (u.user_metadata?.phone as string) ?? "",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
    };
}

export async function listEmployees(): Promise<Employee[]> {
    await requireAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);
    return data.users
        .filter((u) => u.user_metadata?.role === "employee")
        .map(toEmployee);
}

export async function createEmployee(payload: {
    email: string;
    password: string;
    name: string;
    phone: string;
}): Promise<{ error?: string }> {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
            role: "employee",
            name: payload.name,
            phone: payload.phone,
        },
    });
    if (error) return { error: error.message };
    return {};
}

export async function updateEmployee(
    id: string,
    payload: { name: string; phone: string }
): Promise<{ error?: string }> {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(id, {
        user_metadata: { role: "employee", name: payload.name, phone: payload.phone },
    });
    if (error) return { error: error.message };
    return {};
}

export async function resetEmployeePassword(
    id: string,
    password: string
): Promise<{ error?: string }> {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(id, { password });
    if (error) return { error: error.message };
    return {};
}

export async function deleteEmployee(id: string): Promise<{ error?: string }> {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return { error: error.message };
    return {};
}
