"use client";

import { useState } from "react";

const initialPrompt = `Chocolate Cake Recipe`;
const mockResponseWithImage = {
  title: "Chocolate Cake Recipe",
  ingredients: [
    "1) All-purpose flour (200g)",
    "2) Cocoa powder (50g)",
    "3) Granulated sugar (200g)",
    "4) Baking powder (2 teaspoons)",
    "5) Salt (1/2 teaspoon)",
    "6) Milk (1 cup)",
    "7) Vegetable oil (1/2 cup)",
    "8) Eggs (2)",
    "9) Vanilla extract (2 teaspoons)",
    "10) Hot water (1/2 cup)",
    "11) Butter (for greasing the pan)",
    "12) Powdered sugar (for dusting on the cake)",
  ],
  instructions: [
    "1) Preheat the oven to 350°F/180°C",
    "2) Grease a 9-inch cake pan with butter",
    "3) In a mixing bowl, whisk together flour, cocoa powder, granulated sugar, baking powder, and salt until well combined",
    "4) Add milk, vegetable oil, eggs, and vanilla extract into the same bowl and mix thoroughly",
    "5) Gradually add hot water to the mixture and continue to whisk until it is smooth",
    "6) Pour the batter into the greased cake pan and bake for 30 to 35 minutes or until a toothpick inserted in the center comes out clean",
    "7) Remove the cake from the oven and let it cool completely before dusting it with powdered sugar",
    "8) Slice and serve the cake once it is completely cooled",
  ],
  preperationTime: "10 minutes",
  cookingTime: "35 minutes",
  noOfServings: 6,
  image: "cake.png",
};

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mockMode, setMockMode] = useState(true);
  async function handleOnGenerate(ev) {
    ev.preventDefault();
    const promptEl = Array.from(ev.target.elements).find(
      (el) => el.name === "prompt"
    );
    if (promptEl) {
      const prompt = promptEl.value;
      setResult("");
      setLoading(true);
      if (mockMode) {
        const promise = new Promise((resolve) => {
          setTimeout(() => {
            resolve(mockResponseWithImage);
          }, 500);
        });

        promise.then((data) => {
          setLoading(false);
          console.log(data);
          setResult(data);
        });
      } else {
        const resp = await fetch("/api/recipe", {
          method: "POST",
          body: JSON.stringify({
            prompt: prompt,
          }),
        });
        const { data } = await resp.json();

        if (data.title) {
          const imageResponse = await fetch("/api/recipe-image", {
            method: "POST",
            body: JSON.stringify({
              prompt: data.title,
            }),
          });
          const { image } = await imageResponse.json();
          setLoading(false);
          const newData = { ...data, image };
          setResult(newData);
        } else {
          setLoading(false);
          setResult(data);
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-100 h-full p-4 antialiased">
      <h1 className="text-2xl font-mono font-extrabold">AI Cooking Recipes</h1>
      <form className="w-full m-4" onSubmit={handleOnGenerate}>
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <textarea
            defaultValue={initialPrompt}
            className="flex-grow appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            rows={2}
            placeholder="Search for a recipe..."
            aria-label="Search for a recipe"
            name="prompt"
          ></textarea>
          <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
            Search
          </button>
        </div>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-teal-600"
              checked={mockMode}
              onChange={() => {
                setMockMode((prev) => !prev);
              }}
            />
            <span className="ml-2 text-gray-700 text-xs">Mock OpenAI response</span>
          </label>
        </div>
      </form>

      {loading && <div>Loading...</div>}
      <div>
        {result && (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48"
                  src={result.image}
                  alt={result.title}
                />
              </div>
              <div className="p-8">
                <div className="block text-lg leading-tight font-medium text-black hover:underline pb-4">
                  {result.title}
                </div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Preparation time:{" "}
                  <span id="prep-time">{result.preperationTime}</span>
                </div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Cooking time: <span id="cook-time">{result.cookingTime}</span>
                </div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  No. of servings:{" "}
                  <span id="servings">{result.noOfServings}</span>
                </div>
                <p className="mt-2 text-gray-500">Ingredients:</p>
                <ul id="ingredients" className="list-inside">
                  {result.ingredients.map((ingredient) => {
                    return <li key={ingredient}>{ingredient}</li>;
                  })}
                </ul>
                <p className="mt-2 text-gray-500">Instructions:</p>
                <ol id="instructions" className="list-inside">
                  {result.instructions.map((instruction) => {
                    return <li key={instruction}>{instruction}</li>;
                  })}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
