import {
  GithubLogoIcon,
  XLogoIcon,
  LinkedinLogoIcon,
  TerminalIcon,
  TelegramLogoIcon,
} from "./PhosphorIcons";
import ContactForm from "./ContactForm";

const SOCIAL_LINKS = [
  {
    name: "Github",
    icon: <GithubLogoIcon size={20} />,
    href: "https://github.com/Eddy3129",
    color: "hover:text-white",
  },
  {
    name: "Twitter",
    icon: <XLogoIcon size={20} />,
    href: "https://x.com/eddyfy_eth",
    color: "hover:text-blue-400",
  },
  {
    name: "LinkedIn",
    icon: <LinkedinLogoIcon size={20} />,
    href: "https://www.linkedin.com/in/eddy-limfy/",
    color: "hover:text-blue-600",
  },
  {
    name: "Telegram",
    icon: <TelegramLogoIcon size={20} />,
    href: "https://t.me/eddy3129",
    color: "hover:text-neon-green",
  },
];

const TERMINAL_LOGS = [
  { text: "> Initializing secure handshake...", color: "text-gray-500" },
  { text: "> Establishing connection to eddy's email...", color: "text-gray-500" },
  { text: "> Ready for message transmission.", color: "text-neon-green" },
];

export default function Contact() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-black/50 to-neon-green/10 text-gray-200 md:p-12 pt-8 md:pt-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="flex items-end gap-4 mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-white">
            Contact<span className="text-neon-green">_</span>
          </h1>
          <div className="h-px flex-1 bg-linear-to-r from-neon-green/50 to-transparent mb-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left Column: Social Links & Info */}
          <div className="flex flex-col justify-center space-y-8 lg:pr-12 order-1 lg:order-1">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Let's Connect
              </h2>
              <p className="text-gray-400 pr-6 leading-relaxed text-justify">
                I'm open to new roles, collaborative projects, and connecting
                with inspiring people. If you have an opportunity, an idea, or
                simply want to say GM, feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-mono text-neon-green tracking-wider uppercase">
                Social Protocols
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`social-link group ${social.color}`}
                  >
                    <div className="text-gray-400 group-hover:text-inherit transition-colors">
                      {social.icon}
                    </div>
                    <span className="font-mono text-sm text-gray-300 group-hover:text-white">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Decorative Code Block */}
            <div className="hidden md:block p-4 rounded-lg bg-black/50 border border-white/5 font-mono text-xs text-gray-500">
              <p>
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-400">status</span> ={" "}
                <span className="text-green-400">"open to work & network"</span>
                ;
              </p>
              <p className="mt-2">
                <span className="text-purple-400">if</span> (
                <span className="text-blue-400">project</span>.isInteresting)
                &#123;
              </p>
              <p className="pl-4">
                <span className="text-yellow-400">await</span>{" "}
                <span className="text-blue-400">reply</span>.send(
                <span className="text-green-400">"LFG!"</span>);
              </p>
              <p>
                &#125; <span className="text-purple-400">else if</span> (
                <span className="text-blue-400">person</span>.isInteresting)
                &#123;
              </p>
              <p className="pl-4">
                <span className="text-yellow-400">await</span>{" "}
                <span className="text-blue-400">reply</span>.send(
                <span className="text-green-400">"Let's connect! :)"</span>);
              </p>
              <p className="pl-4">
                <span className="text-blue-400">connection</span>++;
              </p>
              <p>&#125;</p>
            </div>
          </div>

          {/* Right Column: Terminal Form */}
          <div className="w-full order-2 lg:order-2">
            <div className="glass rounded-xl overflow-hidden border border-white/10 bg-[#050505] shadow-[0_0_40px_rgba(0,255,157,0.05)]">
              {/* Terminal Header */}
              <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 flex items-center gap-2 text-xs font-mono text-gray-500">
                  <TerminalIcon size={12} />
                  <span>bash — contact.sh</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 md:p-8 font-mono text-xs md:text-sm">
                <div className="mb-8 space-y-2 text-gray-400">
                  <div className="flex gap-2">
                    <span className="text-neon-green">
                      0xEddy@web3forms:~$
                    </span>
                    <span className="typing-effect">./initiate_contact.sh</span>
                  </div>
                  <div className="text-gray-500 pl-4 border-l border-white/10">
                    {TERMINAL_LOGS.map((log, index) => (
                      <div key={index} className={log.color}>
                        {log.text}
                      </div>
                    ))}
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
