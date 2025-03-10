"use client";

import DoctorList from "@/components/DoctorList";
import Link from "next/link";

const DoctorsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 p-8">
      <div className="container mx-auto max-w-[900px]">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <h1 className="text-4xl font-bold text-cyan-900">
            Policlínica Tafí Viejo
          </h1>
          <img src="/logo.png" alt="Logo" className="w-24 h-24" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
          <DoctorList />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center pb-8">
          <div className="flex gap-4 mt-8">
            {/* <Link
              href="/doctors/manage"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              Gestionar Doctores
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
