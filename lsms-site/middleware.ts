import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // Sadece token'ı olan geçebilir, ama biz burada 
    // "giriş yapıldı mı?" diye bakıyoruz
    authorized: ({ token }) => !!token,
  },
});

export const config = { matcher: ["/personel/:path*"] };