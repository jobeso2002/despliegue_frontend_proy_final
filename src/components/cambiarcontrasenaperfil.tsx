import { useState } from "react";
import { useAuthStore } from "@/store/authstore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const { changePassword, loading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.newPasswordConfirmation) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await changePassword(form);
      toast.success("Contraseña cambiada exitosamente");
      onClose();
      setForm({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Error al cambiar la contraseña");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input
              type={showCurrent ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Contraseña actual"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-2 top-9 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mb-4 relative">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              type={showNew ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Nueva contraseña"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-2 top-9 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mb-6 relative">
            <Label htmlFor="newPasswordConfirmation">
              Confirmar Nueva Contraseña
            </Label>
            <Input
              type={showConfirm ? "text" : "password"}
              id="newPasswordConfirmation"
              name="newPasswordConfirmation"
              value={form.newPasswordConfirmation}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Confirmar nueva contraseña"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-9 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
