import {
  Link,
  useLocation,
  useSearchParams,
  useTransition,
} from '@remix-run/react';
const colorMap = {
  SportGrey: '#B0AFA9',
  Navy: '#234569',
  White: '#FFFFFF',
  Black: '#080808',
};
export default function ProductOptions({options, selectedVariant}) {
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();

  const paramsWithDefaults = (() => {
    const defaultParams = new URLSearchParams(currentSearchParams);

    if (!selectedVariant) {
      return defaultParams;
    }

    for (const {name, value} of selectedVariant.selectedOptions) {
      if (!currentSearchParams.has(name)) {
        defaultParams.set(name, value);
      }
    }

    return defaultParams;
  })();

  // Update the in-flight request data from the 'transition' (if available)
  // to create an optimistic UI that selects a link before the request is completed
  const searchParams = transition.location
    ? new URLSearchParams(transition.location.search)
    : paramsWithDefaults;

  return (
    <div className="grid my-4  border-b border-neutral-200">
      {options.map((option) => {
        if (!option.values.length) {
          return;
        }
        const isColor = option.name.toLowerCase() === 'color';
        // get the currently selected option value
        const currentOptionVal = searchParams.get(option.name);
        return (
          <div
            key={option.name}
            className="flex pb-4 gap-y-1 last:mb-0 w-full pt-4 border-t border-neutral-200"
          >
            <div className="flex flex-col w-1/4">
              <h3 className="whitespace-pre-wrap max-w-prose font-semibold text-lead min-w-[4rem]">
                {option.name}
              </h3>
              <h3 className="whitespace-pre-wrap max-w-prose font-medium text-lead min-w-[4rem] text-sm text-red-600">
                {currentOptionVal}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-3/4">
              {option.values.map((value: string) => {
                const linkParams = new URLSearchParams(searchParams);
                const isSelected = currentOptionVal === value;
                linkParams.set(option.name, value);
                if (isColor) {
                  const color = colorMap[value.replace(/\s/g, '')];
                  return (
                    <Link
                      key={value}
                      style={{
                        backgroundColor: color,
                        borderColor: isSelected
                          ? color === '#FFFFFF'
                            ? '#585858'
                            : color
                          : '#585858',
                      }}
                      to={`${pathname}?${linkParams.toString()}`}
                      preventScrollReset
                      replace
                      className={`w-9 h-9 border cursor-pointer ${
                        isSelected
                          ? 'border-2 p-1 bg-clip-content'
                          : 'border-neutral-50'
                      }`}
                    ></Link>
                  );
                }
                return (
                  <Link
                    key={value}
                    to={`${pathname}?${linkParams.toString()}`}
                    preventScrollReset
                    replace
                    className={`w-9 h-9 flex justify-center items-center  border-neutral-400 border leading-none cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-neutral-800 border-2 p-1 bg-clip-content font-bold'
                        : 'border-neutral-400 font-normal '
                    }`}
                  >
                    {value}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
