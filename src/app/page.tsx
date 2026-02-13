"use client";

import { useState } from "react";

type Subject = {
  credit: number;
  grade: number;
};

export default function Home() {
  // =======================
// STATE MANAGEMENT
// =======================

  // Degree
  const [degree, setDegree] = useState<"DSAI" | "ES">("DSAI");

  // Mode
  const [mode, setMode] = useState<"current" | "future">("current");

  // Subjects
  const [dsaiSubjects, setDsaiSubjects] = useState<Subject[]>([
    { credit: 0, grade: 0 },
  ]);

  const [esSubjects, setEsSubjects] = useState<Subject[]>([
    { credit: 0, grade: 0 },
  ]);

  const [futureSubjects, setFutureSubjects] = useState<Subject[]>([]);

  // Active list
  const currentSubjects =
    degree === "DSAI" ? dsaiSubjects : esSubjects;

  const setCurrentSubjects =
    degree === "DSAI" ? setDsaiSubjects : setEsSubjects;

  const activeSubjects =
    mode === "current" ? currentSubjects : futureSubjects;

  const setActiveSubjects =
    mode === "current" ? setCurrentSubjects : setFutureSubjects;

  // Add subject
  const addSubject = () => {
    setActiveSubjects([
      ...activeSubjects,
      { credit: 0, grade: 0 },
    ]);
  };

  // Update subject
  const updateSubject = (
    index: number,
    field: "credit" | "grade",
    value: number
  ) => {
    setActiveSubjects((prev) => {
      const copy = [...prev];

      if (!copy[index]) return prev;

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return copy;
    });
  };

  // Grades
  const getGradesForDegree = () => {
    if (degree === "DSAI") {
      return [
        { label: "S", value: 10 },
        { label: "A", value: 9 },
        { label: "B", value: 8 },
        { label: "C", value: 7 },
        { label: "D", value: 6 },
        { label: "E", value: 5 },
        { label: "U / Fail", value: 0 },
      ];
    }

    return [
      { label: "S", value: 10 },
      { label: "A", value: 9 },
      { label: "B", value: 8 },
      { label: "C", value: 7 },
      { label: "D", value: 6 },
      { label: "F / Fail", value: 0 },
    ];
  };

  // CGPA
  const calculate = (list: Subject[]) => {
    let credits = 0;
    let points = 0;

    list.forEach((s) => {
      credits += s.credit;
      points += s.credit * s.grade;
    });

    if (credits === 0) return "0.00";

    return (points / credits).toFixed(2);
  };

  // Reset
  const resetAll = () => {
    setDsaiSubjects([{ credit: 0, grade: 0 }]);
    setEsSubjects([{ credit: 0, grade: 0 }]);
    setFutureSubjects([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex justify-center items-start py-10">


      <div className="w-full max-w-2xl bg-slate-950 p-6 rounded-xl shadow-xl">

      <h1 className="text-3xl font-bold mb-2">
        Namdapha CGPA Calculator
      </h1>

      <p className="mb-6 text-slate-400">
        For BS Data Science & Electronic Systems
      </p>

      {/* Degree */}
      <div className="mb-4">
        <label className="block mb-1">Degree</label>

        <select
          value={degree}
          onChange={(e) =>
            setDegree(e.target.value as "DSAI" | "ES")
          }
          className="w-full p-2 rounded bg-slate-800"
        >
          <option value="DSAI">DSAI</option>
          <option value="ES">ES</option>
        </select>
      </div>

      {/* Mode */}
      <div className="mb-6 flex gap-2">

        <button
          onClick={() => setMode("current")}
          className={`px-4 py-2 rounded ${
            mode === "current"
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >
          Current
        </button>

        <button
          onClick={() => setMode("future")}
          className={`px-4 py-2 rounded ${
            mode === "future"
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >
          Future
        </button>

      </div>

      {/* Subjects */}
      {activeSubjects.map((sub, i) => (
        <div
          key={i}
          className="bg-slate-800 p-4 rounded mb-4"
        >
          <label>Credits</label>

          <input
            type="number"
            value={sub.credit}
            onChange={(e) =>
              updateSubject(i, "credit", Number(e.target.value))
            }
            className="w-full p-2 mt-1 mb-3 rounded bg-slate-900"
          />

          <label>Grade</label>

          <select
            value={sub.grade}
            onChange={(e) =>
              updateSubject(i, "grade", Number(e.target.value))
            }
            className="w-full p-2 mt-1 rounded bg-slate-900"
          >
            <option value={0}>Select</option>

            {getGradesForDegree().map((g) => (
              <option key={g.label} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-2 mb-6">

        <button
          onClick={addSubject}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          + Add
        </button>

        <button
          onClick={resetAll}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Reset
        </button>

      </div>

      {/* Result */}
      {mode === "current" ? (
        <h2 className="text-xl font-bold">
          CGPA: {calculate(currentSubjects)}
        </h2>
      ) : (
        <div>
          <p>
            Current: {calculate(currentSubjects)}
          </p>

          <h2 className="text-xl font-bold mt-1">
            Predicted:{" "}
            {calculate([
              ...currentSubjects,
              ...futureSubjects,
            ])}
          </h2>
        </div>
      )}
      </div>
    </main>
  );
}
