export class SPC 
  {
      static get NA() 
    {
      return 6.02214076e23;
    }

    static get aSphere()
    {
        return 1.0
    }

    static get bSphere()
    {
        return 4 * Math.PI;
    }

    static get cSphere()
    {
        return SPC.bSphere / 3.0;
    }

    static get aCube()
    {
        return 0.75
    }

    static get bCube()
    {
        return 6.0
    }

    static get cCube()
    {
        return 1.0;
    }

   static Bi(i)
    {
        var val = 0.0;
        val = ((i - 1.0) * (i - 2.0) * (Math.pow(SPC.aSphere, 2)) * (Math.pow(SPC.bSphere, 2)) / (6 * (Math.pow(SPC.cSphere, 2))));
        val = val + ((i - 1.0) * ((SPC.aSphere * SPC.bSphere) / SPC.cSphere));
        val = i * (val + 1.0);
        return val;
    }

   static ZFactor(conc, iterations,  v)
        {
            var z = 0.0;
            var psi = (conc * v) / 1000.0;

            for (let i = 2; i <= iterations; i++)
            {
                z = z + (SPC.Bi(i) * Math.pow(psi, i - 1));
            }
            return z + 1;
        }

    static NumberDensity(conc, mw)
        {
            return (conc * SPC.NA) / (1000.0 * mw);
        }

    static CharacteristicDimension(v, mw)
        {
            return ((mw * v) / (Math.pow(SPC.NA * SPC.cSphere, 1.0 / 3.0)));
        }

  }