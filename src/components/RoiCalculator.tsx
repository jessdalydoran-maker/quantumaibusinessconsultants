"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";

const WEEKS_PER_MONTH = 4.33;

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function RoiCalculator() {
  const [hours, setHours] = useState(15);
  const [hourlyValue, setHourlyValue] = useState(50);
  const [automatable, setAutomatable] = useState(50);

  const { monthlyCost, hoursReclaimed, monthlyValueReclaimed } = useMemo(() => {
    const monthlyCost = hours * hourlyValue * WEEKS_PER_MONTH;
    const hoursReclaimed = (hours * automatable) / 100;
    const monthlyValueReclaimed = hoursReclaimed * hourlyValue * WEEKS_PER_MONTH;
    return { monthlyCost, hoursReclaimed, monthlyValueReclaimed };
  }, [hours, hourlyValue, automatable]);

  return (
    <div className="grid gap-10 rounded-sm border border-border bg-bg-alt p-8 md:grid-cols-2 md:p-12">
      <div className="space-y-8">
        <div>
          <label htmlFor="hours" className="flex items-baseline justify-between text-sm text-text-muted">
            <span>Admin hours per week</span>
            <span className="font-display text-lg text-gold">{hours} hrs</span>
          </label>
          <input
            id="hours"
            type="range"
            min={1}
            max={40}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-3 w-full accent-[#c9a227]"
          />
        </div>

        <div>
          <label htmlFor="value" className="flex items-baseline justify-between text-sm text-text-muted">
            <span>Your hourly value</span>
            <span className="font-display text-lg text-gold">{formatGBP(hourlyValue)}</span>
          </label>
          <input
            id="value"
            type="range"
            min={15}
            max={150}
            step={5}
            value={hourlyValue}
            onChange={(e) => setHourlyValue(Number(e.target.value))}
            className="mt-3 w-full accent-[#c9a227]"
          />
        </div>

        <div>
          <label
            htmlFor="automatable"
            className="flex items-baseline justify-between text-sm text-text-muted"
          >
            <span>Share of that admin you think could realistically be automated</span>
            <span className="font-display text-lg text-gold">{automatable}%</span>
          </label>
          <input
            id="automatable"
            type="range"
            min={10}
            max={90}
            step={5}
            value={automatable}
            onChange={(e) => setAutomatable(Number(e.target.value))}
            className="mt-3 w-full accent-[#c9a227]"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between border-t border-border pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-text-muted">What that admin currently costs, monthly</p>
            <p className="font-display text-3xl text-text">{formatGBP(monthlyCost)}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Hours you could reclaim, weekly</p>
            <p className="font-display text-3xl text-gold">{hoursReclaimed.toFixed(1)} hrs</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Value of that time, monthly</p>
            <p className="font-display text-3xl text-gold">{formatGBP(monthlyValueReclaimed)}</p>
          </div>
        </div>
        <div className="mt-8">
          <Button href="/contact" variant="primary" className="w-full">
            Discuss What This Looks Like for You
          </Button>
          <p className="mt-3 text-xs text-text-muted">
            An illustrative planning estimate, not a guarantee — every business automates a different
            share of its admin depending on what&apos;s actually involved. We&apos;ll give you a
            realistic picture on a discovery call.
          </p>
        </div>
      </div>
    </div>
  );
}
