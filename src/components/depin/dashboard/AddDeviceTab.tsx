import { useWalletContext } from '@/contexts/WalletContext';
import AuthPrompt from '../AuthPrompt';
import AddDeviceForm from '../AddDeviceForm';

interface AddDeviceTabProps {
  onDeviceAdded: () => void;
  onOpenSetupGuide?: () => void;
}

const AddDeviceTab = ({ onDeviceAdded, onOpenSetupGuide }: AddDeviceTabProps) => {
  const { isAuthenticated, session } = useWalletContext();

  if (!isAuthenticated || !session?.user) {
    return <AuthPrompt />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AddDeviceForm
        userId={session.user.id}
        onDeviceAdded={onDeviceAdded}
        onOpenSetupGuide={onOpenSetupGuide}
      />
    </div>
  );
};

export default AddDeviceTab;
