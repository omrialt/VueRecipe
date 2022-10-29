<template>
  <b-container class="my-3">
    <the-spinner v-if="loading"></the-spinner>
    <div v-if="recipe && !loading">
      <b-row>
        <b-col md="3">
          <h1>{{ recipeName }}</h1>
          <p class="bold">{{ recipeDescription }}</p>
          <p>מתאים ל {{ recipeMealFor }} סועדים</p>
          <p>הועלה ע"י {{ recipeAuthor }}</p>
          <p>{{ recipeInFavorites }}</p>
          <div class="d-flex">
            תגיות:
            <router-link
              v-for="category in recipeCategories"
              :key="category"
              :to="`/recipes/category/${category}`"
            >
              {{ category }}
            </router-link>
          </div>
          <b-button
            v-if="userInfo && !thisUserIsTheAuthor"
            @click="handleFavorite"
            class="my-3"
            :variant="recipeAlreadyInFavorites?.favorite ? 'danger' : 'primary'"
            >{{ recipeAlreadyInFavorites.text }}</b-button
          >
          <SocialBar
            :title="recipeName"
            :description="recipeDescription"
          ></SocialBar>
          <div class="d-flex" v-if="thisUserIsTheAuthor">
            <b-button variant="danger" class="my-3" @click="deleteRecipe"
              >מחק מתכון</b-button
            >
            <b-button variant="info" class="my-3 mx-2" @click="goToUpdate"
              >עדכן מתכון</b-button
            >
          </div>
        </b-col>
        <b-col md="8" class="center">
          <img :src="recipeImage" :alt="recipeName" />
        </b-col>
      </b-row>
      <hr class="divider" />
      <b-row class="my-3">
        <b-col md="6">
          <h3>מצרכים:</h3>
          <ul>
            <li class="bold" v-for="ing in recipeIngredients" :key="ing">
              {{ ing }}
            </li>
          </ul>
        </b-col>
        <b-col cols="6">
          <h3>שלבים:</h3>
          <ul>
            <StepItem
              v-for="(step, index) in recipeSteps"
              :key="index"
              :idx="index"
              :step="step"
            />
          </ul>
        </b-col>
      </b-row>
      <hr class="divider" />
      <b-row>
        <b-col md="6">
          <h3>תגובות</h3>
          <b-row v-if="recipeReviews.length">
            <comment-item
              v-for="comment in recipeReviews"
              :key="comment._id"
              :comment="comment.comment"
              :userName="comment.name"
            ></comment-item>
          </b-row>
          <b-row v-else>
            <h4>לא נוספו תגובות למתכון זה</h4>
          </b-row>
          <b-button
            v-if="
              !thisUserIsTheAuthor &&
              userInfo &&
              !recipeAlreadyReview &&
              !reviewSent
            "
            class="my-3"
            variant="primary"
            @click="handleShowComment"
            >{{ showComment ? "הסתר" : "הוסף תגובה" }}</b-button
          >
          <div v-if="showComment && !reviewSent">
            <b-form-group id="comment" description="הוסף תגובתך">
              <b-form-textarea
                id="commentText"
                v-model="commentText"
                placeholder="הוסף תגובה.."
                rows="5"
                max-rows="6"
                min="10"
                required
              ></b-form-textarea>
            </b-form-group>
            <b-button class="mb-3" variant="success" @click="addReview"
              >שלח</b-button
            >
            <p v-if="commentError" class="text-danger">{{ commentError }}</p>
          </div>
        </b-col>
      </b-row>
      <hr class="divider" />
      <div v-if="similarList.length > 0">
        <h3>מתכונים דומים:</h3>
        <b-row>
          <recipe-item
            v-for="item in similarList"
            :key="item._id"
            :recipe="item"
          >
          </recipe-item>
        </b-row>
      </div>
      <div v-else>
        <h3>לא נמצאו מתכונים דומים..</h3>
      </div>
    </div>
    <div v-else-if="!loading && !recipe">
      <h2>לא ניתן לטעון את המתכון המבוקש, אנא נסו שנית..</h2>
    </div>
  </b-container>
</template>
<script>
import StepItem from "../components/ui/StepItem.vue";
import CommentItem from "../components/ui/CommentItem.vue";
import SocialBar from "../components/ui/SocialBar.vue";
import Swal from "sweetalert2";
export default {
  components: { StepItem, CommentItem, SocialBar },
  data() {
    return {
      recipe: {},
      similarList: [],
      loading: true,
      showComment: false,
      commentError: null,
      reviewSent: false,
    };
  },
  computed: {
    recipeId() {
      return this.$store.getters["recipes/recipe"]._id;
    },
    recipeName() {
      return this.$store.getters["recipes/recipe"].name;
    },
    recipeCategories() {
      return this.$store.getters["recipes/recipe"].category;
    },
    recipeDescription() {
      return this.$store.getters["recipes/recipe"].description;
    },
    recipeImage() {
      return this.$store.getters["recipes/recipe"].image;
    },
    recipeInFavorites() {
      const inFavorites = +this.$store.getters["recipes/recipe"].inFavorites;
      if (inFavorites > 0) {
        return `${inFavorites} אנשים הוסיפו מתכון זה למועדפים`;
      }
      return "";
    },
    recipeIngredients() {
      return this.$store.getters["recipes/recipe"].ingredients;
    },
    recipeMealFor() {
      return this.$store.getters["recipes/recipe"].mealFor;
    },
    recipeSteps() {
      return this.$store.getters["recipes/recipe"].steps;
    },
    recipeUpdate() {
      return new Date(
        this.$store.getters["recipes/recipe"].updatedAt
      ).toLocaleDateString();
    },
    recipeAuthor() {
      if (this.$store.getters["recipes/recipe"].author) {
        return this.$store.getters["recipes/recipe"].author;
      }
      return "מנהל";
    },
    recipeUser() {
      if (this.$store.getters["recipes/recipe"].user) {
        return this.$store.getters["recipes/recipe"].user;
      }
      return "";
    },
    recipeReviews() {
      return this.$store.getters["recipes/recipe"].reviews;
    },
    userInfo() {
      return this.$store.getters["users/userLogin"] ? true : false;
    },
    recipeAlreadyInFavorites() {
      const recipe = this.$store.getters["users/userLogin"]?.favorites?.find(
        (recipe) => recipe._id === this.recipe._id
      );
      if (recipe) {
        return { favorite: true, text: "הסרה ממועדפים" };
      }
      return { favorite: false, text: "הוספה למועדפים" };
    },
    thisUserIsTheAuthor() {
      if (this.$store.getters["users/userLogin"]?._id === this.recipe?.user) {
        return true;
      }
      return false;
    },
    recipeAlreadyReview() {
      const userLoginId = this.$store.getters["users/userLogin"]?._id || null;
      const alreadyReview = this.recipe.reviews.some(
        (rev) => rev.user === userLoginId
      );
      if (alreadyReview) {
        return true;
      }
      return false;
    },
  },
  async created() {
    this.loadRecipe();
  },
  methods: {
    async loadRecipe() {
      const recipeId = this.$route.params.id;
      await this.$store.dispatch("recipes/loadRecipe", recipeId);
      this.recipe = await this.$store.getters["recipes/recipe"];
      await this.loadSimilar(recipeId);
      this.loading = false;
    },
    async loadSimilar(currentId) {
      const recipeCategories = await this.recipeCategories.join(",");
      await this.$store.dispatch("recipes/loadSimilar", {
        categories: recipeCategories,
        current: currentId,
      });
      this.similarList = await this.$store.getters["recipes/similarList"];
    },
    async handleFavorite() {
      if (!this.recipeAlreadyInFavorites.favorite) {
        Swal.fire({
          icon: "success",
          title: "המתכון נוסף למועדפים!",
          showConfirmButton: false,
          timer: 1500,
        });
        this.$store.dispatch("users/addRecipeToFavorites", this.recipe);
      } else {
        Swal.fire({
          icon: "success",
          title: "המתכון הוסר מהמועדפים!",
          showConfirmButton: false,
          timer: 1500,
        });
        this.$store.dispatch("users/removeRecipeFromFavorites", this.recipe);
      }
    },
    handleShowComment() {
      this.showComment = !this.showComment;
    },
    async addReview() {
      const reviewText = this.commentText;
      if (reviewText?.trim().length < 2 || !reviewText) {
        return (this.commentError = "אנא מלא לפחות 2 תווים");
      }
      Swal.fire({
        icon: "success",
        title: "תגובה נוספה בהצלחה!",
        showConfirmButton: false,
        timer: 1500,
      });
      this.$store.dispatch("recipes/addReview", {
        comment: reviewText,
        name: this.$store.getters["users/userLogin"].name,
      });
      this.commentError = null;
      this.reviewSent = true;
      this.showComment = false;
    },
    async deleteRecipe() {
      Swal.fire({
        icon: "success",
        title: "המתכון הסור בהצלחה !",
        showConfirmButton: false,
        timer: 1500,
      });
      this.$store.dispatch("recipes/deleteRecipe", this.recipeId);
      await this.$store.dispatch("recipes/loadRecipes");
      await this.$router.replace("/");
    },
    goToUpdate() {
      this.$router.replace(`/recipes/update/${this.recipeId}`);
    },
  },
};
</script>
<style scoped>
.center {
  justify-content: center;
  display: flex;
}
.divider {
  border-top: 3px solid #bbb;
}
a {
  margin-left: 4px;
}
.bold {
  font-weight: bold;
}
@media screen and (max-width: 576px) {
  img {
    width: 300px;
  }
  .bold {
    max-width: 250px;
  }
  .card {
    width: 350px !important;
  }
}
</style>
