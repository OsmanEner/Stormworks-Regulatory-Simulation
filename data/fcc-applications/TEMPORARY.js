// FCC LICENSE / APPLICATION — COPY THIS FILE AND RENAME TO THE CALL SIGN.
// Example: WB9XCZ.js matches the ready-to-use WB9XCZ row in fcc-license-records.js.
// Add as many objects to manufacturers or stationLocations as needed.
// Empty fields show as —. The call sign is read from the filename/table record.
window.fccApplication = {
  title: `FCC License / Application Details`,

  // General Information — the same sample values as the active table record.
  fileNumber: `0009876543`,
  licensee: `Space Exploration Technologies Corp.`,
  frn: `5247927013`,
  type: `Experimental`,
  status: `Active`,
  classOfStation: `FX MO`,
  effectiveDate: `November 10th, 2026`,

  // Explanation: why the STA is necessary (supports blank lines).
  explanation: ``,

  // Purpose of Operation (supports blank lines).
  purposeOfOperation: ``,

  // Requested Period of Operation.
  operationStartDate: ``,
  operationEndDate: ``,

  // Manufacturer — one object = one row; add/remove as many as needed.
  // Illustrative equipment entries based on the reference screenshot.
  manufacturers: [
    {
      manufacturer: `Orbit Technology`,
      modelNumber: `AL-4016-1SPACEX`,
      numberOfUnits: `1`,
      experimental: `Yes`
    },
    {
      manufacturer: `M2 Antenna Systems`,
      modelNumber: `FGFD-1-SC-2-N`,
      numberOfUnits: `1`,
      experimental: `Yes`
    }
  ],

  // Station Location — add one object per site; duplicate a block for more locations.
  // These 3 example locations/values are fictional test data, not actual FCC authorizations.
  // Each location has its own Action / Frequency / Station Class rows.
  // Output Power/ERP and the other black-box fields are intentionally omitted.
  stationLocations: [
    { // Station 1 — fictional example data
      city: `Boca Chica`,
      state: `Texas`,
      latitude: `North 25 59 10`,
      longitude: `West 97 11 17`,
      mobile: `No`,
      radiusOfOperation: ``,
      datum: `NAD 83`,
      directionalAntenna: `Yes`,
      exhibitSubmitted: `No`,
      beamWidthDegrees: `3.50`,
      horizontalOrientation: `225`,
      verticalOrientation: `15`,
      exceedsSixMeters: `Yes`,
      antennaHeightMeters: `18.5`,
      groundElevationMeters: `1.0`,
      nearestAircraftLandingAreaKm: `29.64`,
      shieldingStructures: `not specified`, // Natural or man-made shielding structures
      frequencyEntries: [
        { action: `Modified`, frequency: `2085.68750000- MHz`, stationClass: `FX` },
        { action: `Modified`, frequency: `2090.00000000- MHz`, stationClass: `FX` }
      ]
    },
    { // Station 2 — fictional example data
      city: `Brownsville`,
      state: `Texas`,
      latitude: `North 25 54 34`,
      longitude: `West 97 25 30`,
      mobile: `No`,
      radiusOfOperation: ``,
      datum: `NAD 83`,
      directionalAntenna: `Yes`,
      exhibitSubmitted: `No`,
      beamWidthDegrees: `5.20`,
      horizontalOrientation: `180`,
      verticalOrientation: `7`,
      exceedsSixMeters: `Yes`,
      antennaHeightMeters: `42.0`,
      groundElevationMeters: `9.5`,
      nearestAircraftLandingAreaKm: `11.20`,
      shieldingStructures: `Low buildings and vegetation`, // Natural or man-made shielding structures
      frequencyEntries: [
        { action: `New`, frequency: `2247.00000000 MHz`, stationClass: `FX` },
        { action: `Modified`, frequency: `2255.50000000 MHz`, stationClass: `MO` }
      ]
    },
    { // Station 3 — fictional example data
      city: `McGregor`,
      state: `Texas`,
      latitude: `North 31 26 56`,
      longitude: `West 97 24 47`,
      mobile: `Yes`,
      radiusOfOperation: `12 km`,
      datum: `WGS 84`,
      directionalAntenna: `No`,
      exhibitSubmitted: `Yes`,
      beamWidthDegrees: ``,
      horizontalOrientation: ``,
      verticalOrientation: ``,
      exceedsSixMeters: `No`,
      antennaHeightMeters: `4.5`,
      groundElevationMeters: `188.0`,
      nearestAircraftLandingAreaKm: `8.30`,
      shieldingStructures: `Terrain and existing structures`, // Natural or man-made shielding structures
      frequencyEntries: [
        { action: `New`, frequency: `2205.00000000 MHz`, stationClass: `MO` },
        { action: `Modified`, frequency: `2210.00000000 MHz`, stationClass: `FX` }
      ]
    }
  ]
};
