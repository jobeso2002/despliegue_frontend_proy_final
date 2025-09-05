import React from "react";

interface EventoTabsProps {
  activeTab: "planificados" | "en_curso" | "finalizados" | "cancelados";
  setActiveTab: (
    tab: "planificados" | "en_curso" | "finalizados" | "cancelados"
  ) => void;
  counts: {
    planificados: number;
    en_curso: number;
    finalizados: number;
    cancelados: number;
  };
}

const EventoTabs: React.FC<EventoTabsProps> = ({
  activeTab,
  setActiveTab,
  counts,
}) => {
  return (
    <div className="flex border-b mb-6 overflow-x-auto">
      <button
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "planificados"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("planificados")}
      >
        Planificados ({counts.planificados})
      </button>
      <button
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "en_curso"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("en_curso")}
      >
        En Curso ({counts.en_curso})
      </button>
      <button
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "finalizados"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("finalizados")}
      >
        Finalizados ({counts.finalizados})
      </button>
      <button
        className={`px-4 py-2 font-medium whitespace-nowrap ${
          activeTab === "cancelados"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("cancelados")}
      >
        Cancelados ({counts.cancelados})
      </button>
    </div>
  );
};

export default EventoTabs;
