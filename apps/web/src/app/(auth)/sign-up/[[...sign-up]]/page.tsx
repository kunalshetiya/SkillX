import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <SignUp appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm font-bold',
          card: 'shadow-xl border-2 border-gray-50 rounded-3xl'
        }
      }} />
    </div>
  );
}
