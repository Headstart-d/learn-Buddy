import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      router.push('/signin');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return handleLogout;
};

export default useLogout;