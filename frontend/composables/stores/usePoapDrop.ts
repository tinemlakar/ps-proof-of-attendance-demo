import { FormInst, FormRules, FormValidationError, useMessage } from 'naive-ui';

export default function usePoapDrop() {
  const message = useMessage();
  const loading = ref(false);
  const formRef = ref<FormInst | null>(null);
  const currStep = ref(1);

  const formData = reactive<any>({
    title: null,
    description: null,
    collectionUuid: null,
    startTime: null,
    endTime: null,
    website: null,
  });

  const rules: FormRules = {
    title: [
      {
        required: true,
        type: 'string',
        trigger: 'input',
      },
    ],
    startTime: [
      {
        required: true,
        type: 'date',
        trigger: 'input',
      },
    ],
    endTime: [
      {
        required: true,
        type: 'date',
        trigger: 'input',
      },
    ],
  };

  // Submit
  function handleSubmit(e: Event | MouseEvent) {
    e.preventDefault();
    formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
      if (errors) {
        errors.map(fieldErrors =>
          fieldErrors.map(error => message.warning(error.message || 'Error'))
        );
      } else {
        currStep.value = 3;
      }
    });
  }
  return {
    currStep,
    formData,
    formRef,
    loading,
    rules,
    handleSubmit,
  };
}
