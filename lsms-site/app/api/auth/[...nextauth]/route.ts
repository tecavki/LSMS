import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  secret: "lsms_gizli_sifre_test_icin_12345", // Hata payını sıfırlamak için direkt buraya yazdık
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      console.log("👉 DİKKAT: JWT BİLETİ OLUŞTURULDU!");
      if (profile) token.id = (profile as any).id;
      return token;
    },
    async session({ session, token }) {
      console.log("👉 DİKKAT: OTURUM SİSTEME YANSITILDI!");
      if (session.user) (session.user as any).id = token.id;
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };