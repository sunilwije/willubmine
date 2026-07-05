import React from 'react';
import { FileText, Check, Shield } from 'lucide-react';

interface ConsentDocumentProps {
  targetName: string;
  requesterName: string;
  onSign: () => void;
  isSigned: boolean;
}

export const ConsentDocument: React.FC<ConsentDocumentProps> = ({ 
  targetName, 
  requesterName, 
  onSign,
  isSigned 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Digital Consent Form</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Legally Binding</span>
        </div>
      </div>

      <div className="prose prose-sm text-gray-600 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <p className="mb-4">
          I, <strong>{targetName}</strong>, hereby grant permission to <strong>willubemin.com</strong> to conduct a background verification check on my behalf, as requested by <strong>{requesterName}</strong>.
        </p>
        <p className="mb-4">
          This verification may include, but is not limited to, searching public records regarding:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Identity verification</li>
          <li>Employment history</li>
          <li>Marital status records</li>
          <li>Public safety records</li>
        </ul>
        <p>
          I understand that this information will be used solely for the purpose of establishing trust within the platform and will be shared with the requester.
        </p>
      </div>

      <div className="flex items-center justify-end gap-4">
        {isSigned ? (
          <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-lg border border-green-100">
            <Check className="h-5 w-5" />
            <span>Signed Digitally by {targetName}</span>
          </div>
        ) : (
          <button
            onClick={onSign}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <FileText className="h-4 w-4" />
            Sign & Grant Consent
          </button>
        )}
      </div>
    </div>
  );
};
