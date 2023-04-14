import React from 'react';

function CareInstructions() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-3 text-center">
        <h2 className="text-3xl font-bold mb-4">WASH & CARE INSTRUCTIONS</h2>
        <p className="text-sm mb-4">
          To ensure that your DTG-printed garments remain in good condition for
          as long as possible, it's important to follow the care instructions
          carefully. The following steps are recommended:
        </p>
        <ul className="list-disc ml-8 mb-4 text-sm">
          <li>
            Machine-wash your DTG-printed garments cold and inside-out on a
            gentle cycle using a mild detergent and similar colors.
          </li>
          <li>
            Use non-chlorine bleach only when necessary. Bleach can damage the
            fibers of the garment and cause the print to deteriorate faster.
          </li>
          <li>
            Avoid using fabric softeners or dry cleaning the items. Fabric
            softeners can cause the print to crack, and dry cleaning can cause
            the colors to fade or bleed.
          </li>
          <li>
            While DTG-printed apparel can be tumble-dried on a low cycle, it's
            recommended to hang-dry them instead. This helps prevent the garment
            from shrinking or losing its shape, and it also helps the print to
            last longer.
          </li>
          <li>
            If you need to iron your apparel, make sure to use a cool iron
            inside-out and avoid ironing the print directly. Ironing the print
            can cause it to melt or stick to the iron, ruining the design.
          </li>
          <li>
            Do not dry clean your DTG-printed garments. Dry cleaning can damage
            the fibers of the garment and cause the print to fade or bleed.
          </li>
        </ul>
        <p className="text-sm">
          By following these instructions carefully, you can help ensure that
          your printed apparel remains in good condition for as long as
          possible. This will help you get the most out of your investment and
          enjoy your favorite designs for years to come.
        </p>
      </div>
    </div>
  );
}

export default CareInstructions;
