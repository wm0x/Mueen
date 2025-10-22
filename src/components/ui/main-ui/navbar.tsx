import CardNav from "./CardNav";


function Navbar() {
    const items = [
        {
          label: "عن مُعين",
          bgColor: "#0D0716",
          textColor: "#fff",
          links: [
            { label: "من نحن", ariaLabel: "عن منصة مُعين", href: "/about" },
            { label: "فريقنا", ariaLabel: "فريق مُعين", href: "/team" },
          ],
        },
        {
          label: "الخدمات",
          bgColor: "#170D27",
          textColor: "#fff",
          links: [
            { label: "حل الواجبات", ariaLabel: "خدمة حل الواجبات", href: "/services/homework" },
            { label: "المشاريع والتطبيقات", ariaLabel: "خدمة المشاريع", href: "/services/projects" },
            { label: "العروض التقديمية", ariaLabel: "خدمة العروض التقديمية", href: "/services/presentations" },
          ],
        },
        {
          label: "تواصل معنا",
          bgColor: "#271E37",
          textColor: "#fff",
          links: [
            { label: " واتساب ", ariaLabel: "تواصل عبر البريد الإلكتروني", href: "mailto:contact@mueen.com" },
            { label: "ديسكورد", ariaLabel: "تابعنا على تويتر", href: "https://twitter.com/mueen" },
            { label: "تيليجرام", ariaLabel: "تابعنا على لينكدإن", href: "https://linkedin.com/company/mueen" },
          ],
        },
      ];
      
  return (
    <div>
      {" "}
      <CardNav
        logo={"./mueen.png"}
        logoAlt="mueen Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
    </div>
  );
}

export default Navbar;
