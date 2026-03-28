import {
  CodeBracketIcon,
  ComputerDesktopIcon,
  ServerIcon,
  CircleStackIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  CloudIcon,
  BeakerIcon,
  DevicePhoneMobileIcon,
  QuestionMarkCircleIcon,
  DocumentIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

export const safeRender = (data) => {
  if (typeof data === "string") return data;
  if (typeof data === "number" || typeof data === "boolean")
    return String(data);
  if (typeof data === "object" && data !== null) {
    return (
      data.description ||
      data.name ||
      data.category ||
      data.suggestion ||
      data.message ||
      data.title ||
      JSON.stringify(data)
    );
  }
  return "";
};

export const getFileIcon = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"].includes(extension)) {
    return <PhotoIcon className="w-4 h-4 text-pink-400" />;
  } else if (["js", "jsx", "ts", "tsx"].includes(extension)) {
    return <CodeBracketIcon className="w-4 h-4 text-yellow-400" />;
  } else if (extension === "json") {
    // using CodeBracket for json since Cube is not imported here for files but it's okay, user used Cube
    return <CodeBracketIcon className="w-4 h-4 text-orange-400" />;
  } else if (["css", "scss", "sass", "less"].includes(extension)) {
    return <CodeBracketIcon className="w-4 h-4 text-blue-400" />;
  } else if (["html", "htm"].includes(extension)) {
    return <CodeBracketIcon className="w-4 h-4 text-red-400" />;
  } else if (["md", "markdown"].includes(extension)) {
    return <DocumentIcon className="w-4 h-4 text-purple-400" />;
  } else if (["py"].includes(extension)) {
    return <CodeBracketIcon className="w-4 h-4 text-green-400" />;
  } else if (["java"].includes(extension)) {
    return <CodeBracketIcon className="w-4 h-4 text-orange-400" />;
  } else {
    return <DocumentIcon className="w-4 h-4 text-[#64748B]" />;
  }
};

export const countFiles = (items) => {
  if (!items) return 0;
  let count = 0;
  items.forEach((item) => {
    if (item.type === "file") count++;
    if (item.children) count += countFiles(item.children);
  });
  return count;
};

export const countDirs = (items) => {
  if (!items) return 0;
  let count = 0;
  items.forEach((item) => {
    if (item.type === "dir") {
      count++;
      if (item.children) count += countDirs(item.children);
    }
  });
  return count;
};

export const getCategoryIcon = (category) => {
  const icons = {
    languages: <CodeBracketIcon className="w-5 h-5" />,
    frontend: <ComputerDesktopIcon className="w-5 h-5" />,
    backend: <ServerIcon className="w-5 h-5" />,
    database: <CircleStackIcon className="w-5 h-5" />,
    ai_ml: <CpuChipIcon className="w-5 h-5" />,
    devTools: <WrenchScrewdriverIcon className="w-5 h-5" />,
    cloud: <CloudIcon className="w-5 h-5" />,
    testing: <BeakerIcon className="w-5 h-5" />,
    mobile: <DevicePhoneMobileIcon className="w-5 h-5" />,
    other: <QuestionMarkCircleIcon className="w-5 h-5" />,
  };
  return icons[category] || icons.other;
};

export const categoryNames = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  ai_ml: "AI/ML",
  devTools: "Dev Tools",
  cloud: "Cloud",
  testing: "Testing",
  mobile: "Mobile",
  other: "Other",
};

export const categoryColors = {
  languages: "from-indigo-500 to-blue-500",
  frontend: "from-blue-500 to-cyan-500",
  backend: "from-green-500 to-emerald-500",
  database: "from-purple-500 to-indigo-500",
  ai_ml: "from-pink-500 to-rose-500",
  devTools: "from-yellow-500 to-amber-500",
  cloud: "from-sky-500 to-blue-500",
  testing: "from-orange-500 to-red-500",
  mobile: "from-violet-500 to-purple-500",
  other: "from-gray-500 to-slate-500",
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
