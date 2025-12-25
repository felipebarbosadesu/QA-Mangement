import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '../common/Button';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (file) {
      onImport(file);
      setFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-800">Importar Excel / CSV</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-[#BC8F2E] bg-[#BC8F2E]/5'
                : 'border-gray-300 hover:border-[#BC8F2E]'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-[#BC8F2E]/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-[#BC8F2E]" />
              </div>
              <div>
                <p className="text-gray-800 mb-1">
                  Clique ou arraste o arquivo aqui
                </p>
                <p className="text-gray-600">Formatos: CSV, XLSX, XLS</p>
              </div>
            </label>
          </div>

          {file && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-gray-800">{file.name}</p>
                <p className="text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-green-600" />
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 mb-2">Formato esperado:</p>
            <p className="text-blue-700">
              Módulo, Cenário, Esperado, Android, iOS, Versão, Perfil, Tabela de Venda, Observações
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleImport}
              disabled={!file}
              className="flex-1"
            >
              Importar
            </Button>
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
