import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ComingSoonDialogProps {
  featureName: string;
  children: React.ReactNode;
}

const ComingSoonDialog = ({ featureName, children }: ComingSoonDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Coming Soon</AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            <span className="font-semibold text-foreground">{featureName}</span> is currently under development. 
            We're working hard to bring you this exciting feature.
            <br /><br />
            Stay tuned for updates!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ComingSoonDialog;
