import { useState, useRef } from "react";
import { Download, Upload, CheckCircle, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";

const CLASSES = [
  { id: 1, name: "Data Structures",                  code: "DS"  },
  { id: 2, name: "Digital Electronics",               code: "DE"  },
  { id: 3, name: "Engineering Mechanics",             code: "EM"  },
  { id: 4, name: "Database Management Systems",       code: "DBMS"},
  { id: 5, name: "Microprocessor & Microcontroller",  code: "MPM" },
  { id: 6, name: "Fluid Mechanics",                   code: "FM"  },
  { id: 7, name: "Web Technologies",                  code: "WT"  },
  { id: 8, name: "Power Systems",                     code: "PS"  },
];

const SECTIONS = [
  { key: "marks", label: "Marks", description: "CIE 1 – CIE 4 and SEE 1 for all students" },
];

interface UploadState {
  file: File | null;
  status: "idle" | "ready" | "error";
  error: string;
}

function makeFileName(classCode: string, sectionKey: string) {
  return `VVCE_${classCode}_${sectionKey.toUpperCase()}.xlsx`;
}

export default function FileUpload() {
  const [selectedClassId, setSelectedClassId] = useState(CLASSES[0].id);
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const cls = CLASSES.find((c) => c.id === selectedClassId)!;

  const getUpload = (key: string): UploadState =>
    uploads[`${selectedClassId}-${key}`] ?? { file: null, status: "idle", error: "" };

  const setUpload = (key: string, state: Partial<UploadState>) =>
    setUploads((prev) => ({
      ...prev,
      [`${selectedClassId}-${key}`]: { ...getUpload(key), ...state },
    }));

  const handleDownload = (sectionKey: string) => {
    const fileName = makeFileName(cls.code, sectionKey);
    // Create a minimal placeholder blob — real content added later
    const blob = new Blob([`VVCE Template: ${cls.name} – ${sectionKey}\n`], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${fileName}`);
  };

  const handleFilePick = (sectionKey: string, file: File) => {
    const expectedName = makeFileName(cls.code, sectionKey);
    if (file.name !== expectedName) {
      setUpload(sectionKey, { file, status: "error", error: `File must be named "${expectedName}"` });
      return;
    }
    setUpload(sectionKey, { file, status: "ready", error: "" });
    toast.success(`${file.name} ready to upload`);
  };

  const handleDrop = (sectionKey: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFilePick(sectionKey, file);
  };

  const handleUpload = (sectionKey: string) => {
    const u = getUpload(sectionKey);
    if (!u.file || u.status !== "ready") return;
    // Placeholder — real upload logic added later
    toast.success(`${u.file.name} uploaded successfully!`);
    setUpload(sectionKey, { file: null, status: "idle", error: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Attainment</h2>
        <p className="text-gray-500 mt-1 text-sm">Download the marks template, fill in the data, then upload the file with the same name</p>
      </div>

      {/* Class Selector */}
      <div className="flex flex-wrap gap-2">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              selectedClassId === c.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Selected class banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-6 py-4 text-white flex items-center gap-4">
        <FileSpreadsheet className="w-8 h-8 opacity-80 shrink-0" />
        <div>
          <p className="font-bold text-lg">{cls.name}</p>
          <p className="text-blue-100 text-sm">Upload the marks Excel file for this class. The file name must match exactly.</p>
        </div>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SECTIONS.map(({ key, label, description }) => {
          const u = getUpload(key);
          const expectedName = makeFileName(cls.code, key);

          return (
            <Card key={key} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-gray-800">{label}</CardTitle>
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(key)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg gap-1.5 shrink-0 ml-3"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Template
                  </Button>
                </div>
                <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">Expected filename:</p>
                  <p className="text-xs text-blue-700 font-mono mt-0.5 break-all">{expectedName}</p>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 space-y-3">
                {/* Drop zone */}
                <div
                  onDrop={(e) => handleDrop(key, e)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => inputRefs.current[key]?.click()}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer py-8 transition-all ${
                    u.status === "ready"
                      ? "border-emerald-300 bg-emerald-50"
                      : u.status === "error"
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                >
                  <input
                    ref={(el) => { inputRefs.current[key] = el; }}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFilePick(key, f); e.target.value = ""; }}
                  />

                  {u.status === "ready" ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                      <p className="text-sm font-semibold text-emerald-700">{u.file?.name}</p>
                      <p className="text-xs text-emerald-500">Ready to upload</p>
                    </>
                  ) : u.status === "error" ? (
                    <>
                      <AlertCircle className="w-8 h-8 text-red-400" />
                      <p className="text-sm font-semibold text-red-600">Wrong file name</p>
                      <p className="text-xs text-red-400 text-center px-4">{u.error}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-500">Drop file here or click to browse</p>
                      <p className="text-xs text-gray-400">.xlsx · .xls · .csv</p>
                    </>
                  )}
                </div>

                {/* Upload button */}
                <Button
                  onClick={() => handleUpload(key)}
                  disabled={u.status !== "ready"}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-40 gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload {label}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
