import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, LogOut, Upload, PawPrint, Settings, FileText, Inbox, Save, Mail } from "lucide-react";
import { defaultPageContent, defaultSettings, SETTINGS_KEY, type SiteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Animal Angels Mont Choisy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "pets" | "content" | "settings" | "inbox";

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("pets");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin");
      setIsAdmin((roles?.length ?? 0) > 0);
      setChecking(false);
    };
    init();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (checking) return <div className="mx-auto max-w-5xl px-5 py-20 text-center text-muted-foreground">Loading…</div>;

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-3xl">Not an admin</h1>
        <p className="mt-3 text-muted-foreground">Your account doesn't have admin access.</p>
        <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof PawPrint }[] = [
    { id: "pets", label: "Pets", icon: PawPrint },
    { id: "content", label: "Page content", icon: FileText },
    { id: "settings", label: "Site settings", icon: Settings },
    { id: "inbox", label: "Inbox", icon: Inbox },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl">Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <Link to="/" className="underline">View public site</Link>
          </p>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border-b-2 -mb-px transition ${
              tab === t.id
                ? "border-primary text-primary bg-primary-soft/30"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "pets" && <PetsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "settings" && <SettingsTab />}
        {tab === "inbox" && <InboxTab />}
      </div>
    </section>
  );
}

// =================== PETS TAB ===================

type Pet = { id: string; name: string; species: string; age: string; sex: string; story: string; photo_url: string | null; status: string; sort_order: number };
type PetForm = { name: string; species: "Dog" | "Cat" | "Other"; age: string; sex: string; story: string; status: "available" | "adopted" | "hidden"; photoFile: File | null };
const emptyForm: PetForm = { name: "", species: "Dog", age: "", sex: "Female", story: "", status: "available", photoFile: null };

function PetsTab() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [form, setForm] = useState<PetForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPets(); }, []);

  const loadPets = async () => {
    const { data, error } = await supabase.from("pets").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
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
        const { error: upErr } = await supabase.storage.from("pet-photos").upload(path, form.photoFile);
        if (upErr) throw upErr;
        photo_url = supabase.storage.from("pet-photos").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("pets").insert({
        name: form.name, species: form.species, age: form.age, sex: form.sex,
        story: form.story, status: form.status, photo_url,
      });
      if (error) throw error;
      toast.success("Pet added");
      setForm(emptyForm);
      loadPets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setSaving(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("pets").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    loadPets();
  };

  const deletePet = async (id: string) => {
    if (!confirm("Delete this pet?")) return;
    const { error } = await supabase.from("pets").delete().eq("id", id);
    if (error) return toast.error(error.message);
    loadPets();
  };

  return (
    <>
      <form onSubmit={addPet} className="grid sm:grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6">
        <h2 className="sm:col-span-2 font-display text-2xl flex items-center gap-2"><Plus className="h-5 w-5" /> Add a new pet</h2>
        <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <Field label="Species"><select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as PetForm["species"] })} className={inputCls}><option>Dog</option><option>Cat</option><option>Other</option></select></Field>
        <Field label="Age"><input required placeholder="e.g. 2 years" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputCls} /></Field>
        <Field label="Sex"><select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={inputCls}><option>Female</option><option>Male</option></select></Field>
        <Field label="Status" className="sm:col-span-2"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as PetForm["status"] })} className={inputCls}><option value="available">Available</option><option value="adopted">Adopted</option><option value="hidden">Hidden</option></select></Field>
        <Field label="Story" className="sm:col-span-2"><textarea rows={3} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className={inputCls} /></Field>
        <Field label="Photo" className="sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-border px-4 py-3 text-sm">
            <Upload className="h-4 w-4" /><span>{form.photoFile?.name ?? "Choose an image…"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setForm({ ...form, photoFile: e.target.files?.[0] ?? null })} />
          </label>
        </Field>
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Add pet"}</button>
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
                <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)} className="flex-1 text-xs rounded-lg border border-border bg-background px-2 py-1.5">
                  <option value="available">Available</option><option value="adopted">Adopted</option><option value="hidden">Hidden</option>
                </select>
                <button onClick={() => deletePet(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {pets.length === 0 && <p className="sm:col-span-2 lg:col-span-3 text-sm text-muted-foreground">No pets yet.</p>}
      </div>
    </>
  );
}

// =================== CONTENT TAB ===================

function ContentTab() {
  const [page, setPage] = useState<keyof typeof defaultPageContent>("home");
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase.from("page_content").select("key,value").eq("page", page).then(({ data }) => {
      const merged = { ...defaultPageContent[page] };
      for (const r of data ?? []) merged[r.key] = r.value;
      setValues(merged);
      setLoading(false);
    });
  }, [page]);

  const save = async () => {
    setSaving(true);
    const rows = Object.entries(values).map(([key, value]) => ({ page, key, value }));
    const { error } = await supabase.from("page_content").upsert(rows, { onConflict: "page,key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Page content saved");
  };

  const isLong = (k: string) => /body|about|story/.test(k);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {Object.keys(defaultPageContent).map((p) => (
            <button key={p} onClick={() => setPage(p as keyof typeof defaultPageContent)} className={`px-4 py-2 rounded-full text-sm font-medium ${page === p ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              /{p === "home" ? "" : p}
            </button>
          ))}
        </div>
        <button onClick={save} disabled={saving || loading} className={btnPrimary}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6">
        {loading ? <p className="text-muted-foreground">Loading…</p> : Object.keys(defaultPageContent[page]).map((k) => (
          <Field key={k} label={k.replace(/_/g, " ")} className={isLong(k) ? "sm:col-span-2" : ""}>
            {isLong(k)
              ? <textarea rows={3} value={values[k] ?? ""} onChange={(e) => setValues({ ...values, [k]: e.target.value })} className={inputCls} />
              : <input value={values[k] ?? ""} onChange={(e) => setValues({ ...values, [k]: e.target.value })} className={inputCls} />}
          </Field>
        ))}
      </div>
    </div>
  );
}

// =================== SETTINGS TAB ===================

function SettingsTab() {
  const [values, setValues] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", SETTINGS_KEY).maybeSingle().then(({ data }) => {
      if (data?.value) setValues({ ...defaultSettings, ...(data.value as Partial<SiteSettings>) });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key: SETTINGS_KEY, value: values }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  const fields: { k: keyof SiteSettings; label: string; long?: boolean }[] = [
    { k: "org_name", label: "Organisation name" },
    { k: "org_tagline", label: "Tagline" },
    { k: "donate_label", label: "Donate button label" },
    { k: "phone", label: "Phone" },
    { k: "email", label: "Email" },
    { k: "address", label: "Address" },
    { k: "whatsapp", label: "WhatsApp link" },
    { k: "facebook_url", label: "Facebook URL" },
    { k: "instagram_url", label: "Instagram URL" },
    { k: "footer_about", label: "Footer about text", long: true },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className={btnPrimary}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-6">
        {fields.map((f) => (
          <Field key={f.k} label={f.label} className={f.long ? "sm:col-span-2" : ""}>
            {f.long
              ? <textarea rows={3} value={values[f.k]} onChange={(e) => setValues({ ...values, [f.k]: e.target.value })} className={inputCls} />
              : <input value={values[f.k]} onChange={(e) => setValues({ ...values, [f.k]: e.target.value })} className={inputCls} />}
          </Field>
        ))}
      </div>
    </div>
  );
}

// =================== INBOX TAB ===================

type Submission = { id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string };

function InboxTab() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (s: Submission) => {
    const { error } = await supabase.from("contact_submissions").update({ is_read: !s.is_read }).eq("id", s.id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h2 className="font-display text-2xl">Messages ({items.length})</h2>
      <div className="mt-4 space-y-3">
        {items.map((s) => (
          <div key={s.id} className={`rounded-2xl border p-5 ${s.is_read ? "bg-card border-border" : "bg-primary-soft/30 border-primary/30"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-semibold">{s.name} <span className="text-xs font-normal text-muted-foreground">· {new Date(s.created_at).toLocaleString()}</span></div>
                <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 text-sm text-primary"><Mail className="h-3.5 w-3.5" /> {s.email}</a>
                {s.subject && <div className="mt-1 text-sm font-medium">{s.subject}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleRead(s)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted">
                  {s.is_read ? "Mark unread" : "Mark read"}
                </button>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-wrap text-foreground/90">{s.message}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
}

// =================== shared ===================

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm";
const btnPrimary = "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold disabled:opacity-50";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
