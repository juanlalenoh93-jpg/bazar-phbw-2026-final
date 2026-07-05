*** Begin Patch
*** Update File: src/routes/bazar.$id.tsx
@@
-  const [name, setName] = useState("");
-  const [price, setPrice] = useState("");
+  const [name, setName] = useState("");
+  const [price, setPrice] = useState("");
+  const [imageData, setImageData] = useState<string | undefined>(undefined);
+  const fileRef = useRef<HTMLInputElement | null>(null);
@@
-  const openEdit = (m: MenuItem) => { setEditId(m.id); setName(m.name); setPrice(String(m.price)); setOpen(true); };
+  const openEdit = (m: MenuItem) => { setEditId(m.id); setName(m.name); setPrice(String(m.price)); setImageData((m as any).image); setOpen(true); };
@@
-    const newMenu: MenuItem = { id: uid(), bazarId, name: name.trim(), price: +price || 0, cost: 0, qty: 0, createdAt: Date.now() };
+    const newMenu: MenuItem = { id: uid(), bazarId, name: name.trim(), price: +price || 0, cost: 0, qty: 0, createdAt: Date.now(), image: imageData };
@@
-                <div>
-                  <Label className="text-xs">Nama Menu</Label>
-                  <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1 text-xs" />
-                </div>
+                <div>
+                  <Label className="text-xs">Nama Menu</Label>
+                  <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl mt-1 text-xs" />
+                </div>
                 <div>
                   <Label className="text-xs">Harga Jual</Label>
                   <Input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} className="rounded-xl mt-1 text-xs" />
                 </div>
+                <div>
+                  <Label className="text-xs">Foto Menu (opsional)</Label>
+                  <div className="flex items-center gap-2 mt-1">
+                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
+                      const f = e.target.files?.[0];
+                      if (!f) return;
+                      const r = new FileReader();
+                      r.onload = () => setImageData(r.result as string);
+                      r.readAsDataURL(f);
+                    }} />
+                    <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} className="rounded-xl text-xs">Pilih Foto</Button>
+                    {imageData && <img src={imageData} alt="preview" className="h-12 w-12 rounded-md object-cover border" />}
+                    {imageData && <Button type="button" size="sm" variant="ghost" onClick={() => setImageData(undefined)} className="text-xs">Hapus</Button>}
+                  </div>
+                </div>
*** End Patch