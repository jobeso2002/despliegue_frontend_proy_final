import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useContactoStore } from "@/store/contacto/contacto";
import { useDeportistaStore } from "@/store/deportista/deportista";
import { Edit, Trash2 } from "lucide-react";
import { ContactoFamiliar } from "@/interface/contactos/contacto.interface";
import ContactoForm from "./actualizarcontacto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ListaContactosDeportista() {
  const { contacto, consultarContacto_Deportistas, eliminarContacto } =
    useContactoStore();
  const { deportistas, ConsultarDeportista } = useDeportistaStore();
  const [selectedDeportista, setSelectedDeportista] = useState<number | null>(
    null
  );
  const [editingContacto, setEditingContacto] =
    useState<ContactoFamiliar | null>(null);

  // Carga los deportistas cuando el componente se monta
  useEffect(() => {
    ConsultarDeportista();
  }, [ConsultarDeportista]);

  // Carga los contactos cuando se selecciona un deportista
  useEffect(() => {
    if (selectedDeportista) {
      consultarContacto_Deportistas(selectedDeportista);
    }
  }, [selectedDeportista, consultarContacto_Deportistas]);

  const handleDelete = async (id: number) => {
    try {
      await eliminarContacto(id);
      if (selectedDeportista) {
        consultarContacto_Deportistas(selectedDeportista);
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  };

  const handleEdit = (contacto: ContactoFamiliar) => {
    setEditingContacto(contacto);
  };

  const handleCancelEdit = () => {
    setEditingContacto(null);
  };

  const handleUpdateSuccess = () => {
    setEditingContacto(null);
    if (selectedDeportista) {
      consultarContacto_Deportistas(selectedDeportista);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Contactos del Deportista
      </h1>

      {/* Selección de deportista */}
      <div className="mb-6">
        <label htmlFor="deportista" className="block mb-2 font-semibold">
          Seleccionar Deportista:
        </label>
        <select
          id="deportista"
          className="border border-gray-300 p-2 rounded w-full"
          onChange={(e) => setSelectedDeportista(Number(e.target.value))}
          value={selectedDeportista || ""}
        >
          <option value="">Seleccione un deportista</option>
          {deportistas.map((deportista) => (
            <option key={deportista.id} value={deportista.id}>
              {deportista.primer_apellido} {deportista.primer_nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario de edición (si está en modo edición) */}
      {editingContacto && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Editar Contacto</h2>
          <ContactoForm
            initialValues={editingContacto}
            onCancel={handleCancelEdit}
            onSuccess={handleUpdateSuccess}
            deportistaId={selectedDeportista!}
          />
        </div>
      )}

      {/* Lista de contactos */}
      {selectedDeportista && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Contactos registrados ({contacto.length})
          </h2>

          {contacto.length === 0 ? (
            <p className="text-gray-500">
              No hay contactos registrados para este deportista.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">Nombre</th>
                    <th className="py-2 px-4 border-b">Parentesco</th>
                    <th className="py-2 px-4 border-b">Teléfono</th>
                    <th className="py-2 px-4 border-b">Emergencia</th>
                    <th className="py-2 px-4 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contacto.map((contacto) => (
                    <tr key={contacto.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        {contacto.nombres} {contacto.apellidos}
                      </td>
                      <td className="py-2 px-4 border-b capitalize">
                        {contacto.parentesco}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {contacto.telefono}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {contacto.esContactoEmergencia ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Emergencia
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(contacto)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Seguro que deseas eliminar este contacto?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El contacto
                                será eliminado permanentemente del deportista
                                seleccionado.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(contacto.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Sí, eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Contacto de emergencia destacado */}
      {selectedDeportista && contacto.some((c) => c.esContactoEmergencia) && (
        <div className="mt-8 p-4 border border-red-200 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Contacto de Emergencia
          </h2>
          {contacto
            .filter((c) => c.esContactoEmergencia)
            .map((contacto) => (
              <div key={contacto.id} className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Nombre:</p>
                  <p>
                    {contacto.nombres} {contacto.apellidos}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Parentesco:</p>
                  <p className="capitalize">{contacto.parentesco}</p>
                </div>
                <div>
                  <p className="font-semibold">Teléfono:</p>
                  <p>{contacto.telefono}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{contacto.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Dirección:</p>
                  <p>{contacto.direccion}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ListaContactosDeportista;
