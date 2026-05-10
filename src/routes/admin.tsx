import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, LogOut, Upload } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Animal Angels Mont Choisy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Pet = {
  id: string;
  name: string;
  species: string;
  age: string;
  sex: string;
  story: string;
  photo_url: string | null;
  status: string;
  sort_order: number;
};

type FormState = {
  name: string;
  species: "Dog" | "Cat" | "Other";
  age: string;
  sex: string;
  story: string;
  status: "available" | "adopted" | "hidden";
  photoFile: File | null;
};

const emptyForm: FormState = {
  name: "",
  species: "Dog",
  age: "",
  sex: "Female",
  story: "",
  status: "available",
  photoFile: null,
};

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      const admin = (roles?.length ?? 0) > 0;
      setIsAdmin(admin);
      setChecking(false);
      if (admin) await loadPets();
    };
    init();
  }, [navigate]);

  const loadPets = async () => {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setPets(data ?? []);
  };

  const addPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photo_url: string | null = null;
      if (form.photoFile) {
        const ext = form.photoFile.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("pet-photos")
          .upload(path, form.photoFile, { cacheControl: "3600", upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("pet-photos").getPublicUrl(path);
        photo_url = data.publicUrl;
      }
      const { error } = await supabase.from("pets").insert({
        name: form.name,
        species: form.species,
        age: form.age,
        sex: form.sex,
        story: form.story,
        status: form.status,
        photo_url,
      });
      if (error) throw error;
      toast.success("Pet added");
      setForm(emptyForm);
      await loadPets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add pet");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("pets").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    await loadPets();
  };

  const deletePet = async (id: string) => {
    if (!confirm("Delete this pet?")) return;
    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await loadPets();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (checking) {
    return <div className="mx-auto max-w-5xl px-5 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl">Not an admin</h1>
        <p className="mt-3 text-muted-foreground">
          Your account is signed in but doesn't have admin access. Ask the site owner to grant you the admin role.
        </p>
        <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Manage pets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Link to="/adopt" className="underline">View public Adopt page</Link>
          </p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <form onSubmit={addPet} className="mt-8 grid sm:grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6">
        <h2 className="sm:col-span-2 font-display text-2xl flex items-center gap-2"><Plus className="h-5 w-5" /> Add a new pet</h2>
        <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <Field label="Species">
          <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as FormState["species"] })} className={inputCls}>
            <option>Dog</option><option>Cat</option><option>Other</option>
          </select>
        </Field>
        <Field label="Age"><input required placeholder="e.g. 2 years" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputCls} /></Field>
        <Field label="Sex">
          <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={inputCls}>
            <option>Female</option><option>Male</option>
          </select>
        </Field>
        <Field label="Status" className="sm:col-span-2">
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })} className={inputCls}>
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="hidden">Hidden</option>
          </select>
        </Field>
        <Field label="Story" className="sm:col-span-2">
          <textarea rows={3} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Photo" className="sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-border px-4 py-3 text-sm">
            <Upload className="h-4 w-4" />
            <span>{form.photoFile?.name ?? "Choose an image…"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setForm({ ...form, photoFile: e.target.files?.[0] ?? null })} />
          </label>
        </Field>
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold disabled:opacity-50">
            {saving ? "Saving…" : "Add pet"}
          </button>
        </div>
      </form>

      <h2 className="mt-12 font-display text-2xl">Current pets ({pets.length})</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border overflow-hidden bg-card">
            {p.photo_url && <img src={p.photo_url} alt={p.name} className="w-full aspect-[4/3] object-cover" />}
            <div className="p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl">{p.name}</h3>
                <span className="text-xs uppercase tracking-wider text-coral">{p.species}</span>
              </div>
              <p className="text-xs text-muted-foreground">{p.age} · {p.sex}</p>
              <p className="mt-2 text-sm text-foreground/80 line-clamp-3">{p.story}</p>
              <div className="mt-4 flex items-center gap-2">
                <select
                  value={p.status}
                  onChange={(e) => updateStatus(p.id, e.target.value)}
                  className="flex-1 text-xs rounded-lg border border-border bg-background px-2 py-1.5"
                >
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                  <option value="hidden">Hidden</option>
                </select>
                <button onClick={() => deletePet(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pets.length === 0 && (
          <p className="sm:col-span-2 lg:col-span-3 text-sm text-muted-foreground">No pets yet — add the first one above.</p>
        )}
      </div>
    </section>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
