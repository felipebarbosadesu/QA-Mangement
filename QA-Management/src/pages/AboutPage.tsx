import React from 'react';
import type { ProjectInfo } from '../types';
import { Package, Target, Shield, Info } from 'lucide-react';

interface AboutPageProps {
  projectInfo: ProjectInfo;
}

export const AboutPage: React.FC<AboutPageProps> = ({ projectInfo }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#BC8F2E] to-[#a37a26] rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-white mb-1">{projectInfo.name}</h2>
            <p className="text-white/90">Versão atual: {projectInfo.version}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-gray-800">Descrição do Projeto</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{projectInfo.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-gray-800">Escopo dos Testes</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{projectInfo.scope}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-gray-800">Regras de Qualidade</h3>
        </div>
        <ul className="space-y-3">
          {projectInfo.qualityRules.map((rule, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#BC8F2E] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{rule}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-blue-800 mb-3">📊 Sobre o Quality Hub</h4>
        <p className="text-blue-700 leading-relaxed mb-3">
          O Quality Hub é uma plataforma centralizada para gestão de testes regressivos do App Vendedor Fast Shop.
          Desenvolvido para facilitar o acompanhamento executivo e garantir a qualidade das releases.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-blue-600 mb-1">Cobertura</p>
            <p className="text-gray-800">7 Módulos</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-blue-600 mb-1">Plataformas</p>
            <p className="text-gray-800">Android & iOS</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-blue-600 mb-1">Tipo</p>
            <p className="text-gray-800">Testes Regressivos</p>
          </div>
        </div>
      </div>
    </div>
  );
};
