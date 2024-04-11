type ChevronProps = {
  isOpen: boolean;
};

const ChevronResponsive = ({ isOpen }: ChevronProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-.707.293z"
      />
    </svg>
  );
};

export default ChevronResponsive;
