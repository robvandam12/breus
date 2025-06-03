
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface DocumentCardProps {
  documents: any[];
  title: string;
  icon: React.ReactNode;
  emptyIcon: React.ReactNode;
  emptyMessage: string;
  emptySubMessage: string;
  onDocumentDeleteAttempt: (type: string) => void;
  documentType: string;
}

export const DocumentCard = ({ 
  documents, 
  title, 
  icon, 
  emptyIcon, 
  emptyMessage, 
  emptySubMessage,
  onDocumentDeleteAttempt,
  documentType
}: DocumentCardProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      </div>
      {documents.length === 0 ? (
        <div className="text-center py-8">
          {emptyIcon}
          <p className="text-zinc-500 mb-2">{emptyMessage}</p>
          <p className="text-sm text-zinc-400">{emptySubMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{doc.codigo || doc.folio}</h4>
                  <p className="text-sm text-gray-600">Supervisor: {doc.supervisor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.firmado ? 'default' : 'secondary'}>
                    {doc.firmado ? 'Firmado' : doc.estado || 'Borrador'}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDocumentDeleteAttempt(documentType)}
                    className="text-gray-400 cursor-not-allowed p-1"
                    disabled
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
