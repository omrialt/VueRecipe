<template>
  <b-container>
    <h2 class="heading">עדכון מתכון</h2>
    <b-form @submit.prevent="onSubmit" @reset="onReset">
      <b-form-group
        id="name"
        label="שם המתכון:"
        label-for="name"
        description="אנא מלא את שם המתכון,השתמש לפחות ב2 תווים"
      >
        <b-form-input
          id="name"
          v-model="recipe.name"
          type="text"
          placeholder="שם המתכון"
          min="2"
          :value="recipeName"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="categories"
        label="קטגוריות:"
        label-for="categories"
        description="אנא מלא קטגוריות,מופרדים בפסיק,יש להוסיף לפחות קטגוריה אחת"
      >
        <b-form-input
          id="categories"
          v-model="recipe.category"
          type="text"
          placeholder="קטגוריות"
          min="2"
          :value="recipeCategories"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="description"
        label="תיאור:"
        label-for="description"
        description="תיאור המנה"
      >
        <b-form-textarea
          id="description"
          v-model="recipe.description"
          placeholder="תיאור המנה"
          rows="3"
          max-rows="6"
          min="10"
          :value="recipeDescription"
          required
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        id="ingredients"
        label="מצרכים:"
        label-for="ingredients"
        description="אנא מלא את המצרכים,מופרדים בירידת שורה"
      >
        <b-form-textarea
          id="ingredients"
          v-model="recipe.ingredients"
          placeholder="מצרכים"
          rows="3"
          max-rows="6"
          min="10"
          :value="recipeIngredients"
          required
        ></b-form-textarea>
      </b-form-group>
      <b-form-group
        id="steps"
        label="שלבי הכנה:"
        label-for="steps"
        description="אנא מלא את השלבים להכנה,מופרדים בירידת שורה"
      >
        <b-form-textarea
          id="steps"
          v-model="recipe.steps"
          placeholder="שלבי הכנה"
          rows="3"
          max-rows="6"
          min="10"
          :value="recipeSteps"
          required
        ></b-form-textarea>
      </b-form-group>
      <b-form-group id="mealFor" label="כמות סועדים" label-for="mealFor">
        <b-form-select
          id="mealFor"
          v-model="recipe.mealFor"
          :options="numbers"
          :value="recipeMealFor"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group
        id="תמונה"
        label="תמונה"
        label-for="name"
        description="אנא הוסף קישור לתמונה של המתכון"
      >
        <b-form-input
          id="image"
          v-model="recipe.image"
          type="text"
          placeholder="תמונה"
          min="2"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">שליחה</b-button>
      <b-button type="reset" variant="danger">איפוס</b-button>
      <p v-if="formIsValid.message" class="text-danger">
        {{ formIsValid.message }}
      </p>
      <p v-if="recipeError" class="text-danger">{{ recipeError }}</p>
    </b-form>
  </b-container>
</template>

<script>
import Swal from "sweetalert2";
export default {
  data() {
    return {
      recipe: {},
      category: "",
      formIsValid: { valid: false, message: null },
    };
  },
  created() {
    const userLogin = this.$store.getters["recipes/user"];
    if (!userLogin) {
      this.$router.replace("/");
    }
    this.loadRecipe();
  },
  computed: {
    numbers() {
      let numbers = [];
      for (let n = 1; n < 9; n++) {
        numbers.push({ text: n, value: n });
      }
      return numbers;
    },
    recipeError() {
      return this.$store.getters["recipes/newRecipeError"];
    },
    recipeId() {
      return this.recipe._id;
    },
    recipeName() {
      return this.recipe.name;
    },
    recipeCategories() {
      return this.$store.getters["recipes/recipe"].category.join(",");
    },
    recipeDescription() {
      return this.$store.getters["recipes/recipe"].description;
    },
    recipeIngredients() {
      return this.$store.getters["recipes/recipe"].ingredients.join("\n");
    },
    recipeMealFor() {
      return this.$store.getters["recipes/recipe"].mealFor;
    },
    recipeSteps() {
      return this.$store.getters["recipes/recipe"].steps.join("\n");
    },
    recipeImage() {
      return this.$store.getters["recipes/recipe"].image;
    },
  },
  methods: {
    async loadRecipe() {
      const recipeId = this.$route.params.id;
      await this.$store.dispatch("recipes/loadRecipe", recipeId);
      this.recipe = await this.$store.getters["recipes/recipe"];
      this.category = await this.recipe.category.join(",");
    },
    onSubmit() {
      let recipeCategories = this.recipe.category.split(",");
      let recipeIngredients = this.recipe.ingredients;
      let recipeSteps = this.recipe.steps;
      const userLogin = this.$store.getters["recipes/user"];
      const recipeName = this.recipe.name;
      const recipeDescription = this.recipe.description;
      const recipeMealFor = this.recipe.mealFor;
      const recipeImage = this.recipe.image;

      if (typeof recipeIngredients === "string") {
        recipeIngredients = recipeIngredients.split("\n");
      }
      if (typeof recipeSteps === "string") {
        recipeSteps = recipeSteps.split("\n");
      }

      if (
        recipeName.trim().length < 2 ||
        recipeCategories.length === 0 ||
        recipeDescription.trim().length < 2 ||
        recipeIngredients.length === 0 ||
        recipeSteps.length === 0
      ) {
        return (this.formIsValid.message =
          "אחד השדות שמולאו לא תקין,אנא נסה שוב");
      } else {
        this.formIsValid.valid = true;
        this.formIsValid.message = null;
        const updatedRecipe = {
          _id: this.recipeId,
          name: recipeName,
          category: recipeCategories,
          description: recipeDescription,
          ingredients: recipeIngredients,
          steps: recipeSteps,
          mealFor: recipeMealFor,
          author: userLogin.name,
          image: recipeImage,
        };
        this.$store.dispatch("recipes/updateRecipe", updatedRecipe);
        setTimeout(() => {
          if (!this.recipeError) {
            Swal.fire({
              icon: "success",
              title: "המתכון עודכן בהצלחה !",
              showConfirmButton: false,
              timer: 1500,
            });
            this.$router.replace("/");
          }
        }, 500);
      }
    },
  },
};
</script>

<style>
.heading {
  text-align: center;
}
.btn {
  margin-left: 4px;
}
</style>
