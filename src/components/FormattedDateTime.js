const FormattedDateTime = ({ value }) => {
  if (!value) return <span>N/A</span>;

  try {
    const date = new Date(value);

    // Format the date portion
    const datePart = date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

    // Format the time portion (HH:mm:ss)
    const timePart = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return (
      <span>
        {datePart} at {timePart}
      </span>
    );
  } catch (error) {
    return <span>Invalid</span>;
  }
};

export default FormattedDateTime;
