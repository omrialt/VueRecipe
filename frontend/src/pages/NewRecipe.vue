<template>
  <b-container>
    <h2 class="heading">העלאת מתכון חדש</h2>
    <b-form @submit.prevent="onSubmit" @reset="onReset">
      <b-form-group
        id="name"
        label="שם המתכון:"
        label-for="name"
        description="אנא מלא את שם המתכון,השתמש לפחות ב2 תווים"
      >
        <b-form-input
          id="name"
          v-model="recipeName"
          type="text"
          placeholder="שם המתכון"
          min="2"
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
          v-model="categories"
          type="text"
          placeholder="קטגוריות"
          min="2"
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
          v-model="description"
          placeholder="תיאור המנה"
          rows="3"
          max-rows="6"
          min="10"
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
          v-model="ingredients"
          placeholder="מצרכים"
          rows="3"
          max-rows="6"
          min="10"
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
          v-model="steps"
          placeholder="שלבי הכנה"
          rows="3"
          max-rows="6"
          min="10"
          required
        ></b-form-textarea>
      </b-form-group>
      <b-form-group id="mealFor" label="כמות סועדים" label-for="mealFor">
        <b-form-select
          id="mealFor"
          v-model="mealFor"
          :options="numbers"
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
          v-model="image"
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
      formIsValid: { valid: false, message: null },
    };
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
  },
  created() {
    const userLogin = this.$store.getters["recipes/user"];
    if (!userLogin) {
      this.$router.replace("/");
    }
  },
  methods: {
    onSubmit() {
      const userLogin = this.$store.getters["recipes/user"];
      const recipeName = this.recipeName;
      const recipeCategories = this.categories.split(",");
      const recipeDescription = this.description;
      const recipeIngredients = this.ingredients.split("\n");
      const recipeSteps = this.steps.split("\n");
      const recipeMealFor = this.mealFor;
      const recipeImage = this.image;

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
        const newRecipe = {
          name: recipeName,
          category: recipeCategories,
          description: recipeDescription,
          ingredients: recipeIngredients,
          steps: recipeSteps,
          mealFor: recipeMealFor,
          image: recipeImage,
          author: userLogin.name,
        };
        this.$store.dispatch("recipes/uploadRecipe", newRecipe);
        setTimeout(() => {
          if (!this.recipeError) {
            Swal.fire({
              icon: "success",
              title: "המתכון נוסף בהצלחה !",
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

<style scoped>
.heading {
  text-align: center;
}
.btn {
  margin-left: 4px;
}
</style>
