import React, { useState } from "react";
import { RefreshCcw, Sparkles, TrendingDown,TriangleAlert, CircleCheckBig } from "lucide-react";

function Insights() {
  const [buttonType, setButtonType] = useState("Recommendations");

  const RenderInsights = () => {
    switch (buttonType) {
      case "Recommendations":
        return (
          <>
            <Recommendations
              title={"Reduce food delivery expenses"}
              impact={"High Impact"}
              subtitle={
                "You spent $120 on food delivery this month, which is 30% higher than your average. Consider cooking at home more often."
              }
              potential={"$85.00/month"}
            />
            <Recommendations
              title={"Switch to a cheaper phone plan"}
              impact={"Medium Impact"}
              subtitle={
                "Based on your usage patterns, you could save by switching to a different phone plan."
              }
              potential={"$45.00/month"}
            />
            <Recommendations
              title={"Consolidate subscription services"}
              impact={"Medium Impact"}
              subtitle={
                "You have 5 entertainment subscriptions totaling $65/month. Consider keeping only your most used services."
              }
              potential={"$35.50/month"}
            />
            <Recommendations
              title={"Use public transportation more often"}
              impact={"Low Impact"}
              subtitle={
                "Your transportation expenses increased by 15% this month, mostly from ride-sharing services."
              }
              potential={"$50.00/month"}
            />
          </>
        );
      case "Spending":
        return (
          <>
            <Spending
              logo={"attention"}
              title={"Shopping"}
              subtitle={
                "Unusual spending increase of 45% compared to your 3-month average"
              }
              anomalies={"$200.50"}
            />
            <Spending
              logo={"correct"}
              title={"Entertainment"}
              subtitle={
                "New recurring subscription detected: Streaming Service ($14.99/month)"
              }
              anomalies={"$14.99"}
            />
          </>
        );
      }
  };

  const RenderLogo = ({logo})=>{
    switch (logo) {
      case "attention":
        return(
          <div className="text-red-500">
            <TriangleAlert />
            </div>
        )
      case "correct":
        return(
          <div className="text-green-500">
            <CircleCheckBig />
          </div>
        )
    }
  }

  const RenderImpact = ({ type }) => {
    switch (type) {
      case "High Impact":
        return (
          <div className="text-white  text-xs font-semibold pl-4 pr-4 rounded-xl flex items-center bg-green-500">
            {type}
          </div>
        );
      case "Low Impact":
        return (
          <div className="text-white  text-xs font-semibold pl-4 pr-4 rounded-xl flex items-center bg-blue-500">
            {type}
          </div>
        );
      case "Medium Impact":
        return (
          <div className="text-white  text-xs font-semibold pl-4 pr-4 rounded-xl flex items-center bg-yellow-500">
            {type}
          </div>
        );
    }
  };

  function Recommendations(props) {
    return (
      <div className="border rounded-md mt-6">
        <div className="m-6">
          <div className="flex justify-between ">
            <div className="font-semibold text-lg">{props.title}</div>
            <RenderImpact type={props.impact} />
          </div>
          <div className="text-gray-500 mt-2 mb-4">{props.subtitle}</div>
        </div>
        <hr />
        <div className="m-6">
          <div className="flex justify-between">
            <div className="text-gray-500 text-sm">Potential Savings</div>
            <div className="text-green-500 font-semibold text-lg">
              {props.potential}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function Spending(props) {
    return (
      <div className="border rounded-md mt-6">
        <div className="m-6">
          <div className="flex justify-between ">
            <div className="flex gap-2 items-center">
            <RenderLogo logo={props.logo} />
            <div className="font-bold text-lg">{props.title}</div>
            </div>
            <div className="font-semibold text-lg">
              {props.anomalies}
            </div>
          </div>
          <div className="text-gray-500 mt-2 mb-4">{props.subtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-4">
      <div className="flex justify-between items-center ">
        <div>
          <div className="flex gap-2 items-center">
            <Sparkles />
            <div className="text-3xl font-bold">AI Financial Insights</div>
          </div>
          <div className="text-gray-500">
            Personalized recommendations based on your spending patterns
          </div>
        </div>
        <button className="border rounded-md p-2 pl-4 pr-4 flex gap-2 hover:bg-gray-100">
          <div>
            <RefreshCcw />
          </div>
          <div>Refresh Insights</div>
        </button>
      </div>
      <div className="border rounded-md p-4 mt-4">
        <div className="text-2xl font-bold">Monthly Summary</div>
        <div className="text-gray-500">Overview of your financial health</div>
        <div className="grid grid-cols-3 mt-4">
          <div>
            <div className="text-gray-500 font-semibold text-sm">
              Monthly Spending
            </div>
            <div className="font-bold text-3xl">$1180.50</div>
            <div className="text-green-500 flex ">
              <TrendingDown />
              5.6% lower than last month
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500">
              Top spending Category
            </div>
            <div className="font-bold text-3xl">Food</div>
            <div className="text-sm font-semibold text-gray-500">
              $350.25 (30% of total)
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-500">
              Savings Potential
            </div>
            <div className="text-green-500 font-bold text-3xl">$215.50</div>
            <div className=" text-gray-500">
              Potential monthly savings ;based on our recommendations
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full rounded-md mt-6 bg-gray-100">
        <button
          value="Recommendations"
          className={`rounded-md py-2 px-1 md:px-2 m-1 text-sm md:text-base ${
            buttonType === "Recommendations" ? "bg-white" : "text-gray-500"
          }`}
          onClick={(e) => setButtonType(e.target.value)}
        >
          Recommendations
        </button>
        <button
          value="Spending"
          className={`rounded-md py-2 px-1 md:px-2 m-1 text-sm md:text-base ${
            buttonType === "Spending" ? "bg-white" : "text-gray-500"
          }`}
          onClick={(e) => setButtonType(e.target.value)}
        >
          Spending Anomalies
        </button>
      </div>
      <div>{RenderInsights()}</div>
    </div>
  );
}

export default Insights;
